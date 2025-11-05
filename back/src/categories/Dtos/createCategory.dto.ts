import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Nombre de la categoria',
    example: 'Tecnología',
    minLength: 3,
    maxLength: 25,
  })
  @IsNotEmpty({ message: 'El nombre de la categoria es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de caracteres' })
  @MinLength(3, { message: 'El nombre debe tener minimo 3 caracteres' })
  @MaxLength(25, {
    message: 'El nombre no puede contener mas de 25 caracteres',
  })
  name: string;
}
