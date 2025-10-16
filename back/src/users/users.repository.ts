import { Injectable, NotFoundException } from '@nestjs/common';
import { IUser, IUserUpdate } from './users.controller';

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
  getAllUserRepository() {
    return this.users;
  }

  getUserNameByIdRepository() {
    return 'este metodo retorna el nombre de un usuario por su id';
  }

  getUserByIdRepository(id: string) {
    const user = this.users.find((user) => user.id === Number(id));
    if (!user) {
      throw new NotFoundException('Este Usuario No existe');
    }
    return user;
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
