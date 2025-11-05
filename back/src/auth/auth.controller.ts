import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/users/Dtos/loginUser.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Autenticacion')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Esta ruta se utiliza para iniciar sesion',
  })
  @ApiResponse({
    status: 200,
    description: 'Devuelve un message con el token del usuario',
  })
  @ApiBody({ type: LoginUserDto })
  @Post('iniciarSesion')
  signIn(@Body() loginUserDto: LoginUserDto) {
    return this.authService.signInService(loginUserDto);
  }
}
