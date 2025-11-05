import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from 'src/entities/categories.entity';
import { Product } from 'src/entities/products.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './Dtos/createProduct.dto';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productDataBase: Repository<Product>,
  ) {}
  //metodo para obtener todos los productos
  async getAllProductsRepository() {
    return await this.productDataBase.find();
  }

  //metodo para obtener un producto por su nombre
  async getProductByName(name: string) {
    return await this.productDataBase.findOne({
      where: { name: name },
    });
  }

  //metodo para crear un nuevo producto
  async postCreateProductRepository(
    createProductDto: CreateProductDto,
    categoryExisting: Categories[],
  ) {
    const newProduct = this.productDataBase.create({
      name: createProductDto.name,
      description: createProductDto.description,
      price: createProductDto.price,
      stock: createProductDto.stock,
      imgUrl: createProductDto.imgUrl,
      categories_id: categoryExisting,
    });
    await this.productDataBase.save(newProduct);
    console.log(`Se creo un nuevo producto con el nombre ${newProduct.name}`);
    return `Nuevo producto creado ${newProduct.name}`;
  }
}
