import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from 'src/entities/categories.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './Dtos/createCategory.dto';
import { UpdateCategoryDto } from './Dtos/updateCategory.dto';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Categories)
    private readonly categoryDataBase: Repository<Categories>,
  ) {}
  //metodo para obtener todas las categorias
  async findAllRepository() {
    return await this.categoryDataBase.find();
  }

  //metodo para buscar una categoria por su nombre
  async findByNameRepository(name: string) {
    return await this.categoryDataBase.findOne({ where: { category: name } });
  }

  //metodo para crear una categoria
  async createRepository(createCategoryDto: CreateCategoryDto) {
    const newCategory = this.categoryDataBase.create({
      category: createCategoryDto.name,
    });
    return await this.categoryDataBase.save(newCategory);
  }

  //metodo para buscar una categoria por su id
  async findByIdRepository(id: string) {
    return await this.categoryDataBase.findOne({ where: { uuid: id } });
  }

  //metodo para actualizar una categoria
  async updateRepository(
    categoryToUpdate: Categories,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    categoryToUpdate.category =
      updateCategoryDto.name || categoryToUpdate.category;
    await this.categoryDataBase.save(categoryToUpdate);
    return 'Categoria actualizada exitosamente';
  }
}
