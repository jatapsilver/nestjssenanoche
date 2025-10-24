import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/users/Dtos/loginUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('iniciarSesion')
  signIn(@Body() loginUserDto: LoginUserDto) {
    return this.authService.signInService(loginUserDto);
  }
}
