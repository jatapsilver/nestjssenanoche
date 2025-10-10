import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Products } from './products.entity';

@Entity({ name: 'categories' })
export class Categories {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: false,
  })
  category: string;

  @ManyToMany(() => Products, (products) => products.categories_id)
  @JoinTable()
  products_id: Products[];
}
