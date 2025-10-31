import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './Dtos/createUser.dto';
import { CredentialsRepository } from 'src/credentials/credentials.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly credentialRepository: CredentialsRepository,
  ) {}
  //servicio para buscar todos los usuarios
  getAllUserServices() {
    return this.userRepository.getAllUserRepository();
  }

  //servicio para obtener un usuario por su id
  async getUserByIdServices(uuid: string) {
    const userExisting = await this.userRepository.getUserById(uuid);
    if (!userExisting) {
      throw new NotFoundException('Este Usuario No existe');
    }
    return userExisting;
  }

  //servicio para obtener el perfil del usuario
  async getUserProfileServices(uuid: string) {
    const userExisting = await this.userRepository.getUserById(uuid);
    if (!userExisting) {
      throw new NotFoundException('Este usuario no existe');
    }
    if (userExisting.credential_id.isActive === false) {
      throw new ConflictException('Este usuario no se encuentra activo');
    }
    return this.userRepository.getUserProfileRepository(userExisting);
  }

  //servicio para obtener los usuarios por nombre
  async getUserByNameService(name: string) {
    const usersExisting =
      await this.userRepository.getUserByNameRepository(name);
    if (usersExisting.length === 0) {
      throw new NotFoundException('No existen usuarios con este nombre');
    }
    return usersExisting;
  }

  //servicio para crear un usuario
  async postCreateUserService(createUserDto: CreateUserDto) {
    const emailExisting = await this.userRepository.getUserByEmail(
      createUserDto.email,
    );
    if (emailExisting) {
      throw new ConflictException('Este email ya se encuentra en uso');
    }
    const usernameExisting = await this.credentialRepository.getUserByUsername(
      createUserDto.username,
    );

    if (usernameExisting) {
      throw new ConflictException('Este username ya esta en uso');
    }
    return this.userRepository.postCreateUserRepository(createUserDto);
  }

  //servicio para un soft delete de un usuario
  async softDeleteUserServices(uuid: string) {
    const userExisting = await this.userRepository.getUserById(uuid);
    if (!userExisting) {
      throw new NotFoundException('Este usuario no existe');
    }
    if (userExisting.credential_id.isActive === false) {
      throw new ConflictException('Este usuario ya esta desactivado');
    }
    return this.userRepository.softDeleteUserRepository(userExisting);
  }
}
