import { StatusOrder } from 'src/enums/statusOrder.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './users.entity';
import { OrderDetail } from './orderDetail.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  addressDelivery: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dateCreated: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  deliveryDate: Date;

  @Column({
    type: 'enum',
    enum: StatusOrder,
    default: StatusOrder.CREATED,
  })
  statusOrder: StatusOrder;

  @Column({
    type: 'decimal',
    scale: 2,
    nullable: false,
  })
  total: number;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn()
  user: User;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  orderDetail: OrderDetail[];
}
