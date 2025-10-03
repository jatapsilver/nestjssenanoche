import { Injectable } from '@nestjs/common';

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
}
