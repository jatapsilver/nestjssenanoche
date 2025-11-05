import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './Dtos/createUser.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesEnum } from 'src/enums/roles.enum';
import { RolesGuard } from 'src/auth/Guards/roles.guard';
import { AuthGuard } from 'src/auth/Guards/auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUserDto } from './Dtos/updateUser.dto';

@ApiTags('Usuarios')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  //Ruta para obtener todos los usuarios y por query obtener usuarios por nombre
  @ApiOperation({
    summary: 'Ruta para obtener todos los usuario o usuario por nombre',
  })
  @ApiResponse({
    status: 200,
    description: 'Devuelve un array con todos los usuarios',
  })
  @ApiQuery({
    name: 'name',
    required: false,
  })
  @ApiBearerAuth()
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
  @ApiOperation({
    summary: 'Esta ruta obtiene un usuario por su uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Devuelve un objeto con el usuario',
  })
  @ApiBearerAuth()
  @Get('userById/:uuid')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  getUserById(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.userService.getUserByIdServices(uuid);
  }

  //ruta para obtener el perfil de un usuario
  @ApiOperation({
    summary: 'Esta ruta Obtiene el perfil del usuario',
  })
  @ApiResponse({
    status: 200,
    description: 'Devuelve un objeto con la informacion del perfil del usuario',
  })
  @ApiBearerAuth()
  @Get('profile/:uuid')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN, RolesEnum.SUPPORT, RolesEnum.USER)
  getUserProfile(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.userService.getUserProfileServices(uuid);
  }

  //ruta para crear un usuario
  @ApiOperation({
    summary: 'Ruta para crear un usuario',
  })
  @ApiResponse({
    status: 201,
    description: 'Devuelve un mensaje de confirmacion de usuario creado',
  })
  @Post('createUser')
  postCreateUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.postCreateUserService(createUserDto);
  }

  // Endpoint para actualizar un usuario

  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado exitosamente.',
  })
  @ApiBearerAuth()
  @Put('updateUser')
  @UseGuards(AuthGuard)
  putUpdateUser(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.putUpdateUserService(updateUserDto);
  }

  // ruta para aplicar soft delete a un usuario
  @ApiOperation({
    summary: 'Esta ruta ejecuta un softDelete para el usuario',
  })
  @ApiResponse({
    status: 200,
    description:
      'Devuelve un mensaje con la confirmacion del softDelete del usuario',
  })
  @ApiBearerAuth()
  @Delete('deleteUser/:uuid')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN, RolesEnum.SUPPORT, RolesEnum.USER)
  softDeleteUser(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.userService.softDeleteUserServices(uuid);
  }
}
