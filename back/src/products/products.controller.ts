import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/Guards/auth.guard';
import { RolesGuard } from 'src/auth/Guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { CreateProductDto } from './Dtos/createProduct.dto';
import { UpdateProductDto } from './Dtos/updateProduct.dto';
import { RolesEnum } from 'src/enums/roles.enum';

@ApiTags('Productos')
@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}
  //ruta para obtener todos los productos
  @ApiOperation({ summary: 'Obtener todos los productos' })
  @ApiResponse({ status: 200, description: 'Lista de productos obtenida.' })
  @Get('getAllProducts')
  getAllProducts() {
    return this.productService.getAllProductsService();
  }

  //Endpoint para crear un nuevo producto
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiResponse({ status: 201, description: 'Producto creado correctamente.' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @Post('createProduct')
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProductService(createProductDto);
  }

  //Endpoint para actualizar un producto
  @ApiOperation({ summary: 'Actualizar un producto' })
  @ApiResponse({
    status: 200,
    description: 'Producto actualizado correctamente.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @Put('updateProduct/:uuid')
  updateProduct(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.updateProductService(uuid, updateProductDto);
  }

  //ruta para eliminar un producto
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiResponse({
    status: 200,
    description: 'Producto eliminado correctamente.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @Delete('delete/:uuid')
  deleteProduct(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.productService.deleteProductsService(uuid);
  }
}
