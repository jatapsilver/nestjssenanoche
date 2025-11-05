import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './Dtos/createUser.dto';
import { CredentialsRepository } from 'src/credentials/credentials.repository';
import { UpdateUserDto } from './Dtos/updateUser.dto';

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

  //servicio para actualizar un usuario
  async putUpdateUserService(updateUserDto: UpdateUserDto) {
    const userExisting = await this.userRepository.getUserById(
      updateUserDto.uuid,
    );
    if (!userExisting) {
      throw new NotFoundException('No existe el usuario');
    }
    if (userExisting.credential_id.isActive === false) {
      throw new ConflictException('Este usuario no esta activo');
    }
    if (updateUserDto.email) {
      const emailExisting = await this.userRepository.getUserByEmail(
        updateUserDto.email,
      );
      if (emailExisting) {
        throw new ConflictException('Este correo ya se encuentra registrado');
      }
    }

    if (updateUserDto.username) {
      const usernameExisting =
        await this.credentialRepository.getUserByUsername(
          updateUserDto.username,
        );
      if (usernameExisting) {
        throw new ConflictException(
          'Este nombre de usuario ya se encuentra en uso',
        );
      }
    }
    return this.userRepository.putUpdateUserRepository(
      userExisting,
      updateUserDto,
    );
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
