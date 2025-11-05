import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'Debe ser el username del usuario',
    example: 'username',
  })
  @IsNotEmpty({
    message: 'el username del usuario es requerida',
  })
  @IsString({
    message: 'el username del usuario debe ser una cadena de caracteres',
  })
  @MinLength(3, {
    message: 'El username del usuario debe tener al menos 3 caracteres',
  })
  @MaxLength(25, {
    message: 'El username del usuario no debe tener mas de 25 caracteres',
  })
  username: string;

  @ApiProperty({
    description: 'Debe ser la contraseña del usuario',
    example: 'Example1234*',
  })
  @IsNotEmpty({
    message: 'el password del usuario es requerida',
  })
  @IsString({
    message: 'el password del usuario debe ser una cadena de caracteres',
  })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,25}$/,
    {
      message:
        'La contraseña debe tener entre 8 y 25 caracteres, incluir mayúscula, minúscula, número y un carácter especial',
    },
  )
  password: string;
}
