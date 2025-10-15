import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Categories } from './categories.entity';
import { OrderDetail } from './orderDetail.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'decimal',
    scale: 2,
    nullable: false,
  })
  price: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  stock: number;

  @Column({
    type: 'text',
    default: 'https://cdn-icons-png.flaticon.com/512/74/74472.png',
  })
  imgUrl: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: Date;

  @ManyToMany(() => Categories, (categories) => categories.product_id)
  categories_id: Categories[];

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.product)
  orderDetail: OrderDetail[];
}
