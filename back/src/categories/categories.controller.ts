import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { AuthGuard } from 'src/auth/Guards/auth.guard';
import { RolesGuard } from 'src/auth/Guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesEnum } from 'src/enums/roles.enum';
import { CreateCategoryDto } from './Dtos/createCategory.dto';
import { UpdateCategoryDto } from './Dtos/updateCategory.dto';

@ApiTags('Categorias')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // Endpoint para obtener todas las categorias
  @ApiOperation({ summary: 'Obtener todas las categorias' })
  @ApiResponse({
    status: 200,
    description: 'Categorias obtenidas exitosamente.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('allCategories')
  findAll() {
    return this.categoriesService.findAllServices();
  }

  //Endpoint para crear una categoria
  @ApiOperation({ summary: 'Crear una categoria' })
  @ApiResponse({
    status: 201,
    description: 'Categoria creada exitosamente.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @Post('createCategory')
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  //Endpoint para actualizar una categoria
  @ApiOperation({ summary: 'Actualizar una categoria' })
  @ApiResponse({
    status: 200,
    description: 'Categoria actualizada exitosamente.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @Put('updateCategory')
  update(@Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.updateCategory(updateCategoryDto);
  }
}
