import { Controller, Get } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('allProducts')
  getAllProducts() {
    return this.productsService.getAllProductsServices();
  }

  @Get('getProductsById')
  getProductsById() {
    return this.productsService.getProductsByIdServices();
  }
}
