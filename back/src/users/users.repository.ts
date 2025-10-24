import { Injectable, NotFoundException } from '@nestjs/common';
import { IUserUpdate } from './users.controller';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './Dtos/createUser.dto';
import { Credential } from 'src/entities/credential.entity';
import * as bcrypt from 'bcrypt';

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
    @InjectRepository(Credential)
    private readonly credentialDataBase: Repository<Credential>,
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

  async getUserByEmail(email: string) {
    return await this.userDataBase.findOne({ where: { email: email } });
  }

  getUpdateUserRepository(
    userExisting: { id: number; name: string; email: string },
    user: IUserUpdate,
  ) {
    userExisting.email = user.email;
    userExisting.name = user.name;
    return this.users;
  }

  async postCreateUserRepository(createUserDto: CreateUserDto) {
    const hashedPassword: string = await bcrypt.hash(
      createUserDto.password,
      10,
    );

    const newCredential = this.credentialDataBase.create({
      username: createUserDto.username,
      password: hashedPassword,
    });
    await this.credentialDataBase.save(newCredential);
    const newUser = this.userDataBase.create({
      name: createUserDto.name,
      lastName: createUserDto.lastname,
      email: createUserDto.email,
      dni: createUserDto.dni,
      phone: createUserDto.phone,
      birthDate: createUserDto.birthDate,
      credential_id: newCredential,
    });
    await this.userDataBase.save(newUser);
    console.log(
      `se creo un nuevo usuario son username: ${newUser.credential_id.username}`,
    );
    return `Usuario ${newUser.name} fue creado en la base de datos`;
  }
}
