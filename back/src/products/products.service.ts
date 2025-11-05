import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { CreateProductDto } from './Dtos/createProduct.dto';
import { CategoriesRepository } from 'src/categories/categories.repository';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  //servicio para obtener todos los productos
  getAllProductsServices() {
    return this.productsRepository.getAllProductsRepository();
  }

  //servicio para crear un nuevo producto
  async postCreateProductService(createProductDto: CreateProductDto) {
    const nameExisting = await this.productsRepository.getProductByName(
      createProductDto.name,
    );
    if (nameExisting) {
      throw new ConflictException('Ya existe un producto con este nombre');
    }
    if (createProductDto.price < 0) {
      throw new BadRequestException(
        'El precio del producto tiene que ser mayor a cero',
      );
    }
    if (createProductDto.stock < 0) {
      throw new BadRequestException(
        'El stock del producto no puede ser negativo',
      );
    }
    const categoryExisting = await this.categoriesRepository.getCategoryById(
      createProductDto.categoriesId,
    );
    if (!categoryExisting) {
      throw new NotFoundException('Esta categoria no existe');
    }
    return this.productsRepository.postCreateProductRepository(
      createProductDto,
      categoryExisting,
    );
  }
}
