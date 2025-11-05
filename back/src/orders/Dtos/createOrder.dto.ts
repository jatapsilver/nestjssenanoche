import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsArray,
  ArrayMinSize,
  MinLength,
} from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'UUID del usuario que realiza la orden',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty({ message: 'El ID del usuario es requerido' })
  @IsUUID('4', { message: 'El ID del usuario debe ser un UUID válido' })
  userId: string;

  @ApiProperty({
    description: 'Dirección de entrega de la orden',
    example: 'Calle 123 #45-67, Bogotá, Colombia',
    minLength: 10,
  })
  @IsNotEmpty({ message: 'La dirección de entrega es requerida' })
  @IsString({ message: 'La dirección debe ser una cadena de caracteres' })
  @MinLength(10, { message: 'La dirección debe tener mínimo 10 caracteres' })
  addressDelivery: string;

  @ApiProperty({
    description: 'Lista de productos con su información de detalle de orden',
    type: 'array',
    example: [
      {
        productId: '550e8400-e29b-41d4-a716-446655440000',
        cant: 2,
        discount: 5.0,
      },
      {
        productId: '660e8400-e29b-41d4-a716-446655440001',
        cant: 1,
        discount: 0,
      },
    ],
  })
  @IsNotEmpty({ message: 'Los productos son requeridos' })
  @IsArray({ message: 'Los productos deben ser un arreglo' })
  @ArrayMinSize(1, { message: 'Debe incluir al menos un producto' })
  products: Array<{
    productId: string;
    cant: number;
    discount?: number;
  }>;
}
