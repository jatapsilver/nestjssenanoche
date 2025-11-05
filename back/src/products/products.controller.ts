import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './Dtos/createProduct.dto';
import { AuthGuard } from 'src/auth/Guards/auth.guard';
import { RolesGuard } from 'src/auth/Guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesEnum } from 'src/enums/roles.enum';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  //ruta para obtener todos los productos
  @Get('allProducts')
  getAllProducts() {
    return this.productsService.getAllProductsServices();
  }

  //ruta para crear un nuevo producto
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @Post('createProduct')
  postCreateProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.postCreateProductService(createProductDto);
  }
}
