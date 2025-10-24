import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { MatchPassword } from 'src/decorators/matchPassword.decorator';

export class CreateUserDto {
  @IsNotEmpty({
    message: 'El nombre del usuario es requerido',
  })
  @IsString({
    message: 'El nombre del usuario debe ser una cadena de caracteres',
  })
  @MinLength(3, {
    message: 'El nombre del usuario debe tener al menos 3 caracteres',
  })
  @MaxLength(25, {
    message: 'El nombre del usuario no debe tener mas de 25 caracteres',
  })
  name: string;

  @IsNotEmpty({
    message: 'El apellido del usuario es requerido',
  })
  @IsString({
    message: 'El apellido del usuario debe ser una cadena de caracteres',
  })
  @MinLength(3, {
    message: 'El apellido del usuario debe tener al menos 3 caracteres',
  })
  @MaxLength(25, {
    message: 'El apellido del usuario no debe tener mas de 25 caracteres',
  })
  lastname: string;

  @IsNotEmpty({
    message: 'La identificacion del usuario es requerida',
  })
  @IsString({
    message: 'La identificacion del usuario debe ser una cadena de caracteres',
  })
  @IsNumberString({}, { message: 'El dni sólo puede contener números' })
  dni: string;

  @IsEmail(
    {},
    {
      message: 'El email no tiene el formato adecuado',
    },
  )
  email: string;

  @IsNotEmpty({
    message: 'El numero de celular del usuario es requerido',
  })
  @IsString({
    message: 'El numero de usuario debe ser una cadena de caracteres',
  })
  @MinLength(10, {
    message:
      'El numero de celular del usuario debe tener al menos 10 caracteres',
  })
  @MaxLength(10, {
    message: 'El numero de celular del usuario debe tener maximo 10 caracteres',
  })
  phone: string;

  @IsNotEmpty({
    message: 'La fecha de nacimiento del usuario es requerida',
  })
  @IsString({
    message:
      'La fecha de nacimiento de usuario debe ser una cadena de caracteres',
  })
  @Matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/, {
    message: 'La fecha debe tener formato dd/mm/aaaa y año entre 1900 y 2099',
  })
  birthDate: string;

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

  @Validate(MatchPassword, ['password'])
  confirmPassword: string;
}
