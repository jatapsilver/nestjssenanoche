import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
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
    message: 'La Descripcion del producto es requerida',
  })
  @IsString({
    message: 'La Descripcion del producto debe ser una cadena caracteres',
  })
  @MinLength(10, {
    message: 'La Descripcion del producto debe tener al menos 10 caracteres',
  })
  @MaxLength(50, {
    message: 'La Descripcion del producto no debe tener mas de 50 caracteres',
  })
  description: string;

  @IsNotEmpty({
    message: 'El precio del producto es requerido',
  })
  @IsInt({
    message: 'El precio del producto debe ser un entero',
  })
  price: number;
  @IsNotEmpty({
    message: 'El stock del producto es requerido',
  })
  @IsInt({
    message: 'El stock del producto debe ser un entero',
  })
  stock: number;

  @IsNotEmpty({
    message: 'El nombre del usuario es requerido',
  })
  @IsString({
    message: 'El nombre del usuario debe ser una cadena de caracteres',
  })
  imgUrl: string;

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
