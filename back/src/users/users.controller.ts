import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get('getAllUsers')
  getAllUser() {
    return this.userService.getAllUserServices();
  }

  @Get('userById')
  getUserById() {
    return 'metodo para obtener un usuario por su id';
  }

  @Get('getUserNameById')
  getUserNameById() {
    return this.userService.getUserNameByIdServices();
  }
}
