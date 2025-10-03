import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}
  getAllUserServices() {
    return this.userRepository.getAllUserRepository();
  }

  getUserNameByIdServices() {
    return this.userRepository.getUserNameByIdRepository();
  }
}
