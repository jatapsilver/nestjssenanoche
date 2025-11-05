import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { UsersRepository } from 'src/users/users.repository';
import { CreateOrderDto } from './Dtos/createOrder.dto';
import { ProductRepository } from 'src/products/products.repository';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly usersRepository: UsersRepository,
    private readonly productRepository: ProductRepository,
  ) {}
  //servicio para obtener todas las órdenes
  getAllOrdersService() {
    return this.ordersRepository.getAllOrdersRepository();
  }

  //servicio para obtener las órdenes de un usuario específico
  async getUserOrdersService(userId: string) {
    const userExisting = await this.usersRepository.getUserById(userId);
    if (!userExisting) {
      throw new NotFoundException('Usuario no encontrado');
    }
    if (userExisting.credential_id.isActive === false) {
      throw new NotFoundException('Usuario inactivo');
    }
    return this.ordersRepository.getUserOrdersRepository(userExisting);
  }

  //servicio para crear una nueva orden
  async createOrderService(createOrderDto: CreateOrderDto) {
    // Validar usuario
    const userExisting = await this.usersRepository.getUserById(
      createOrderDto.userId,
    );
    if (!userExisting) {
      throw new NotFoundException('Usuario no encontrado');
    }
    if (userExisting.credential_id.isActive === false) {
      throw new NotFoundException('Usuario inactivo');
    }

    // Validar que hay productos
    if (!createOrderDto.products || createOrderDto.products.length === 0) {
      throw new NotFoundException(
        'No se han proporcionado productos para la orden',
      );
    }

    // Validar cada producto
    for (const product of createOrderDto.products) {
      // Validar que el producto existe
      const productExisting = await this.productRepository.getProductById(
        product.productId,
      );
      if (!productExisting) {
        throw new NotFoundException(
          `Producto con ID ${product.productId} no encontrado`,
        );
      }

      // Validar que el producto está activo
      if (!productExisting.isActive) {
        throw new BadRequestException(
          `El producto ${productExisting.name} no está disponible`,
        );
      }

      // Validar que hay stock suficiente
      if (productExisting.stock < product.cant) {
        throw new BadRequestException(
          `Stock insuficiente para el producto ${productExisting.name}. Disponible: ${productExisting.stock}, Solicitado: ${product.cant}`,
        );
      }

      // Validar que la cantidad es válida
      if (product.cant <= 0) {
        throw new BadRequestException(
          `La cantidad debe ser mayor a 0 para el producto ${productExisting.name}`,
        );
      }
    }
    return this.ordersRepository.createOrderRepository(createOrderDto);
  }
}
