import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './orders.entity';
import { Product } from './products.entity';

@Entity({ name: 'ordersDetails' })
export class OrderDetail {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  cant: number;

  @Column({
    type: 'decimal',
    scale: 2,
    nullable: false,
  })
  subTotal: number;

  @Column({
    type: 'decimal',
    scale: 2,
    nullable: false,
  })
  iva: number;

  @Column({
    type: 'decimal',
    scale: 2,
    nullable: false,
    default: 0,
  })
  discount: number;

  @Column({
    type: 'decimal',
    scale: 2,
    nullable: false,
  })
  shippingFees: number;

  @ManyToOne(() => Order, (order) => order.orderDetail)
  @JoinColumn()
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderDetail)
  @JoinColumn()
  product: Product;
}
