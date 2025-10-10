import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Credential } from './credential.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  dni: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  phone: string;

  @Column({
    type: 'date',
  })
  birthDate: Date;

  @OneToOne(() => Credential, (credential) => credential.user_id)
  @JoinColumn()
  credential_id: Credential;
}
