import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities/orders.entity';
import { User } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './Dtos/createOrder.dto';
import { OrderDetail } from 'src/entities/orderDetail.entity';
import { Product } from 'src/entities/products.entity';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(Order)
    private readonly ordersDataBase: Repository<Order>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailDataBase: Repository<OrderDetail>,
    @InjectRepository(Product)
    private readonly productsDataBase: Repository<Product>,
    @InjectRepository(User)
    private readonly usersDataBase: Repository<User>,
  ) {}
  //metodo para obtener todas las órdenes
  getAllOrdersRepository() {
    return this.ordersDataBase.find({
      relations: ['orderDetail', 'user', 'orderDetail.product'],
    });
  }

  //metodo para obtener las órdenes de un usuario específico
  async getUserOrdersRepository(userExisting: User) {
    return await this.ordersDataBase.find({
      where: { user: userExisting },
      relations: ['order_detail', 'user'],
    });
  }

  //metodo para crear una nueva orden
  async createOrderRepository(createOrderDto: CreateOrderDto) {
    // 1. Obtener el usuario
    const user = await this.usersDataBase.findOne({
      where: { uuid: createOrderDto.userId },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // 2. Crear la orden principal
    const newOrder = this.ordersDataBase.create({
      addressDelivery: createOrderDto.addressDelivery,
      user: user,
      total: 0,
    });
    const savedOrder = await this.ordersDataBase.save(newOrder);

    // 3. Crear los detalles de la orden para cada producto
    const orderDetails: OrderDetail[] = [];
    const IVA_RATE = 0.19; // 19% de IVA

    for (const productItem of createOrderDto.products) {
      // Obtener el producto completo
      const product = await this.productsDataBase.findOne({
        where: { uuid: productItem.productId },
      });

      if (!product) {
        throw new Error(
          `Producto con ID ${productItem.productId} no encontrado`,
        );
      }

      // Calcular valores
      const precioUnitario = Number(product.price);
      const cantidad = productItem.cant;
      const descuento = productItem.discount || 0;

      // Calcular subtotal (precio * cantidad - descuento)
      const subTotal = precioUnitario * cantidad - descuento;

      // Calcular IVA (19% del subtotal)
      const iva = subTotal * IVA_RATE;

      const shippingFees = 0;

      // Crear el detalle de la orden
      const orderDetail = this.orderDetailDataBase.create({
        cant: cantidad,
        subTotal: subTotal,
        iva: iva,
        discount: descuento,
        shippingFees: shippingFees,
        order: savedOrder,
        product: product,
      });

      const savedOrderDetail = await this.orderDetailDataBase.save(orderDetail);
      orderDetails.push(savedOrderDetail);

      const totalOrder = orderDetails.reduce(
        (acc, detail) => acc + Number(detail.subTotal) + Number(detail.iva),
        0,
      );

      newOrder.total = totalOrder;
      await this.ordersDataBase.save(newOrder);

      // Actualizar el stock del producto
      product.stock -= cantidad;
      await this.productsDataBase.save(product);
    }

    // 4. Retornar la orden con sus detalles
    return {
      message: 'Orden creada exitosamente',
      order: {
        uuid: savedOrder.uuid,
        addressDelivery: savedOrder.addressDelivery,
        dateCreated: savedOrder.dateCreated,
        statusOrder: savedOrder.statusOrder,
        orderDetails: orderDetails.map((detail) => ({
          productName: detail.product.name,
          cant: detail.cant,
          subTotal: detail.subTotal,
          iva: detail.iva,
          discount: detail.discount,
          total: Number(detail.subTotal) + Number(detail.iva),
        })),
        totalOrder: orderDetails.reduce(
          (acc, detail) => acc + Number(detail.subTotal) + Number(detail.iva),
          0,
        ),
      },
    };
  }
}
