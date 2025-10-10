import { RolesEnum } from 'src/enums/roles.enum';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './users.entity';

@Entity({ name: 'credentials' })
export class Credential {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  password: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: RolesEnum,
    default: RolesEnum.USER,
  })
  roles: RolesEnum;

  @OneToOne(() => User, (user) => user.credential_id)
  user_id: User;
}
