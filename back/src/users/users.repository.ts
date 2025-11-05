import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './Dtos/createUser.dto';
import { Credential } from 'src/entities/credential.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly userDataBase: Repository<User>,
    @InjectRepository(Credential)
    private readonly credentialDataBase: Repository<Credential>,
  ) {}
  //metodo para obtener todos los usuarios
  async getAllUserRepository() {
    return await this.userDataBase.find();
  }

  //metodo para obtener el perfil de un usuario
  getUserProfileRepository(userExisting: User) {
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

  //metodo para obtener un usuario por su id
  async getUserById(uuid: string) {
    return await this.userDataBase.findOne({
      where: { uuid: uuid },
      relations: ['credential_id', 'orders'],
    });
  }

  //metodo para obtener usuarios por el nombre
  async getUserByNameRepository(name: string) {
    const users = this.userDataBase.find({
      where: { name: name },
    });
    return users;
  }
  //metodo para obtener un usuario por su correo electronico
  async getUserByEmail(email: string) {
    return await this.userDataBase.findOne({ where: { email: email } });
  }

  //metodo para crear un usuario
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

  //metodo para soft delete de un usuario
  async softDeleteUserRepository(userExisting: User) {
    userExisting.credential_id.isActive = false;
    await this.credentialDataBase.save(userExisting.credential_id);
    return { message: `El usuario ${userExisting.name} ha sido desactivado` };
  }
}
