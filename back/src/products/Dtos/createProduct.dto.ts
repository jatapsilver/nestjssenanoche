import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Laptop HP Pavilion',
    maxLength: 100,
    minLength: 3,
  })
  @IsNotEmpty({ message: 'El nombre del producto es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de caracteres' })
  @MinLength(3, { message: 'El nombre debe tener mínimo 3 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede tener más de 100 caracteres' })
  name: string;

  @ApiProperty({
    description: 'Descripción detallada del producto',
    example:
      'Laptop de alto rendimiento con procesador Intel Core i7, 16GB RAM y 512GB SSD',
    minLength: 10,
  })
  @IsNotEmpty({ message: 'La descripción es requerida' })
  @IsString({ message: 'La descripción debe ser una cadena de caracteres' })
  @MinLength(10, { message: 'La descripción debe tener mínimo 10 caracteres' })
  description: string;

  @ApiProperty({
    description: 'Precio del producto',
    example: 1299.99,
    minimum: 0.01,
  })
  @IsNotEmpty({ message: 'El precio es requerido' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El precio debe ser un número con máximo 2 decimales' },
  )
  @IsPositive({ message: 'El precio debe ser un número positivo' })
  price: number;

  @ApiProperty({
    description: 'Cantidad de productos disponibles en stock',
    example: 50,
    minimum: 0,
  })
  @IsNotEmpty({ message: 'El stock es requerido' })
  @IsInt({ message: 'El stock debe ser un número entero' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock: number;

  @ApiProperty({
    description: 'URL de la imagen del producto',
    example: 'https://example.com/images/laptop.jpg',
    required: false,
    default: 'https://cdn-icons-png.flaticon.com/512/74/74472.png',
  })
  @IsOptional()
  @IsUrl({}, { message: 'La URL de la imagen debe ser válida' })
  @IsString({ message: 'La URL debe ser una cadena de caracteres' })
  imgUrl?: string;

  @ApiProperty({
    description: 'Debe ser el UUID de la categoria',
  })
  @IsUUID('4', {
    message: 'Debe ser un UUID',
  })
  @IsNotEmpty({
    message: 'El UUID de la categoria es requerido',
  })
  @IsString({
    message: 'El UUID debe ser una cadena de caracteres',
  })
  categoriesId: string;
}
