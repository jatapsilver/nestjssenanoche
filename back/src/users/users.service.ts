import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { IUser, IUserUpdate } from './users.controller';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}
  getAllUserServices() {
    return this.userRepository.getAllUserRepository();
  }

  getUserNameByIdServices() {
    return this.userRepository.getUserNameByIdRepository();
  }

  getUserByIdServices(id: string) {
    console.log('aca tenemos en id en el servicio', id);
    return this.userRepository.getUserByIdRepository(id);
  }

  getUserByNameService(name: string) {
    return this.userRepository.getUserByNameRepository(name);
  }

  postCreateUserService(user: IUser) {
    if (!user.email || !user.name) {
      throw new ConflictException(
        'El correo electronico y el nombre son obligatorios',
      );
    }
    const userExisting = this.userRepository.getUserByEmail(user.email);
    if (userExisting) {
      throw new ConflictException('Este Correo ya se encuentra registrado');
    }
    return this.userRepository.postCreateUserRepository(user);
  }

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
