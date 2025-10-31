import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './Dtos/createUser.dto';
import { AuthGuard } from 'src/auth/Guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesEnum } from 'src/enums/roles.enum';
import { RolesGuard } from 'src/auth/Guards/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  //Ruta para obtener todos los usuarios y por query obtener usuarios por nombre
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @Get('getAllUsers')
  getAllUser(@Query('name') name: string) {
    if (name) {
      return this.userService.getUserByNameService(name);
    }
    return this.userService.getAllUserServices();
  }

  //ruta para obtener un usuario por su uuid
  @Get('userById/:uuid')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  getUserById(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.userService.getUserByIdServices(uuid);
  }

  //ruta para obtener el perfil de un usuario
  @Get('profile/:uuid')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN, RolesEnum.SUPPORT, RolesEnum.USER)
  getUserProfile(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.userService.getUserProfileServices(uuid);
  }

  //ruta para crear un usuario
  @Post('createUser')
  postCreateUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.postCreateUserService(createUserDto);
  }
  // ruta para aplicar soft delete a un usuario
  @Delete('deleteUser/:uuid')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN, RolesEnum.SUPPORT, RolesEnum.USER)
  softDeleteUser(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.userService.softDeleteUserServices(uuid);
  }
}
