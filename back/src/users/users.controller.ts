import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';

export interface IUser {
  name: string;
  email: string;
}

export interface IUserUpdate {
  id: number;
  name: string;
  email: string;
}

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get('getAllUsers')
  getAllUser(@Query('name') name: string) {
    if (name) {
      return this.userService.getUserByNameService(name);
    }
    return this.userService.getAllUserServices();
  }

  @Get('userById/:id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserByIdServices(id);
  }

  @Get('getUserNameById')
  getUserNameById() {
    return this.userService.getUserNameByIdServices();
  }

  @HttpCode(418)
  @Get('coffees')
  makeCoffee() {
    return 'No puedo preparar cafe por que soy una tetera';
  }

  @HttpCode(201)
  @Get('createdUser')
  createdUser() {
    return 'Usuario creado con exito';
  }

  @Get('findALL')
  findAll(@Res() res: Response) {
    return res.status(201).json({ message: 'Usuarios encontrados' });
  }
  @Post('createUser')
  postCreateUser(@Body() user: IUser) {
    return this.userService.postCreateUserService(user);
  }

  @Put('updateUser')
  putUpdateUser(@Body() user: IUserUpdate) {
    return this.userService.putUpdateUserService(user);
  }
}
