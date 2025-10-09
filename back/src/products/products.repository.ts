import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductsRepository {
  private products = [
    {
      id: 1,
      name: 'Iphone 17 Pro Max',
      description: 'El Iphone saca bonitas fotos',
    },
    {
      id: 2,
      name: 'Iphone 16 Pro max',
      description: 'Otro Iphone',
    },
  ];
  getAllProductsRepository() {
    return this.products;
  }

  getProductsByIdRepository() {
    return 'metodo para buscar un producto por su id';
  }
}
