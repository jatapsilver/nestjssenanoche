import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { IUserUpdate } from './users.controller';
import { CreateUserDto } from './Dtos/createUser.dto';
import { CredentialsRepository } from 'src/credentials/credentials.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly credentialRepository: CredentialsRepository,
  ) {}
  getAllUserServices() {
    return this.userRepository.getAllUserRepository();
  }

  getUserNameByIdServices() {
    return this.userRepository.getUserNameByIdRepository();
  }

  async getUserByIdServices(uuid: string) {
    const userExisting = await this.userRepository.getUserById(uuid);
    if (!userExisting) {
      throw new NotFoundException('Este Usuario No existe');
    }
    if (userExisting.credential_id.isActive === false) {
      throw new ConflictException(
        'Este usuario no esta activo comuniquese con el Administrador',
      );
    }
    return this.userRepository.getUserByIdRepository(userExisting);
  }

  getUserByNameService(name: string) {
    return this.userRepository.getUserByNameRepository(name);
  }

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

  // postCreateUserService(user: IUser) {
  //   if (!user.email || !user.name) {
  //     throw new ConflictException(
  //       'El correo electronico y el nombre son obligatorios',
  //     );
  //   }
  //   const userExisting = this.userRepository.getUserByEmail(user.email);
  //   if (userExisting) {
  //     throw new ConflictException('Este Correo ya se encuentra registrado');
  //   }
  //   return this.userRepository.postCreateUserRepository(user);
  // }

  putUpdateUserService(user: IUserUpdate) {
    const { id, name, email } = user;
    if (!email || !name) {
      throw new ConflictException(
        'El correo electronico y el nombre son obligatorios',
      );
    }
    const userExisting = this.userRepository.getUserByIdRepositoryTwo(id);
    if (!userExisting) {
      throw new NotFoundException('Este Usuario no existe');
    }
    return this.userRepository.getUpdateUserRepository(userExisting, user);
  }
}
