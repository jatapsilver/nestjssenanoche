import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from 'src/entities/categories.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedRepository {
  constructor(
    @InjectRepository(Categories)
    private readonly categoryDataBase: Repository<Categories>,
  ) {}
  async seedCategoryRepository() {
    const countCategory = await this.categoryDataBase.count();
    if (countCategory !== 0) {
      throw new ConflictException('Ya existen las categorias');
    }
    const categories = [
      { category: 'Tecnologia' },
      { category: 'Videojuegos' },
      { category: 'Celulares' },
    ];

    await this.categoryDataBase.save(categories);

    return 'Las categorias se cargaron correctamente';
  }
}
