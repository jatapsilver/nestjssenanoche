import { Injectable, NotFoundException } from '@nestjs/common';

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
}
