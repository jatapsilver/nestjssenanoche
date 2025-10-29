import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CredentialsRepository } from 'src/credentials/credentials.repository';
import { LoginUserDto } from 'src/users/Dtos/loginUser.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly credencialRepository: CredentialsRepository,
    private readonly jwtService: JwtService,
  ) {}
  async signInService(loginUserDto: LoginUserDto) {
    const credentialExisting =
      await this.credencialRepository.getUserByUsername(loginUserDto.username);

    if (!credentialExisting) {
      throw new NotFoundException('Credenciales Invalidas');
    }
    const validatePassword = await bcrypt.compare(
      loginUserDto.password,
      credentialExisting.password,
    );

    if (!validatePassword) {
      throw new NotFoundException('Credenciales Invalidas');
    }

    if (credentialExisting.isActive === false) {
      throw new ConflictException(
        'El usuario esta inactivo comuniquese con el administrador',
      );
    }

    const payload = {
      id: credentialExisting.user_id.uuid,
      role: credentialExisting.roles,
      username: credentialExisting.username,
    };

    const token = this.jwtService.sign(payload);

    return { message: 'Inicio de sesion exitoso', token };
  }
}
