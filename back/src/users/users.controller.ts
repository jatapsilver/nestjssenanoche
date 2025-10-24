import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { UserAuthGuard } from 'src/guards/user-auth.guard';
import { CreateUserDto } from './Dtos/createUser.dto';

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

  @Get('userById/:uuid')
  getUserById(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.userService.getUserByIdServices(uuid);
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

  @UseGuards(UserAuthGuard)
  @HttpCode(201)
  @Get('createdUser')
  createdUser() {
    return 'Usuario creado con exito';
  }

  @UseGuards(UserAuthGuard)
  @Get('findALL')
  findAll(@Res() res: Response) {
    return res.status(201).json({ message: 'Usuarios encontrados' });
  }

  @Get('profile')
  getUserProfile(@Headers('token') token: string) {
    if (token !== '12345') {
      throw new UnauthorizedException();
    }
    return `Soy el perfil del usuario con token: ${token}`;
  }

  @Post('createUser')
  postCreateUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.postCreateUserService(createUserDto);
  }

  // @Post('createUser')
  // @UseInterceptors(DateAdderInterceptor)
  // postCreateUser(@Body() user: IUser, @Req() request) {
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  //   const modifiedUser = { ...user, createAt: request.now };
  //   console.log('Usuario Modificado:', modifiedUser);
  //   return this.userService.postCreateUserService(modifiedUser);
  // }

  @Put('updateUser')
  putUpdateUser(@Body() user: IUserUpdate) {
    return this.userService.putUpdateUserService(user);
  }
}
