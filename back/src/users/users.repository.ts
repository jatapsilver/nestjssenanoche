import { Injectable, NotFoundException } from '@nestjs/common';
import { IUser, IUserUpdate } from './users.controller';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRepository {
  private users = [
    {
      id: 1,
      name: 'javier plata',
      email: 'javierplata@gmail.com',
    },
    {
      id: 2,
      name: 'alexander rueda',
      email: 'alexanderrueda@gail.com',
    },
    {
      id: 3,
      name: 'javier plata',
      email: 'javierplata2@gmail.com',
    },
  ];

  constructor(
    @InjectRepository(User)
    private readonly userDataBase: Repository<User>,
  ) {}
  getAllUserRepository() {
    return this.users;
  }

  getUserNameByIdRepository() {
    return 'este metodo retorna el nombre de un usuario por su id';
  }

  getUserByIdRepository(userExisting: User) {
    const { credential_id, orders, ...userProfile } = userExisting;

    console.log(`Se envio la informacion del usuario: ${userProfile.name}`);
    return {
      ...userProfile,
      username: credential_id.username,
      rol: credential_id.roles,
      isActive: credential_id.isActive,
      orders: orders,
    };
  }

  async getUserById(uuid: string) {
    return await this.userDataBase.findOne({
      where: { uuid: uuid },
      relations: ['credential_id', 'orders'],
    });
  }

  getUserByIdRepositoryTwo(id: number) {
    return this.users.find((user) => user.id === id);
  }

  getUserByNameRepository(name: string) {
    const users = this.users.filter((user) => user.name === name);
    if (users.length <= 0) {
      throw new NotFoundException('No existen usuarios con ese nombre');
    }
    return users;
  }

  getUserByEmail(email: string) {
    return this.users.find((user) => user.email === email);
  }

  postCreateUserRepository(user: IUser) {
    const id = this.users.length + 1;
    const newUser = { id, ...user };
    this.users.push(newUser);
    return this.users;
  }
  getUpdateUserRepository(
    userExisting: { id: number; name: string; email: string },
    user: IUserUpdate,
  ) {
    userExisting.email = user.email;
    userExisting.name = user.name;
    return this.users;
  }
}
