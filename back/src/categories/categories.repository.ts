import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from 'src/entities/categories.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Categories)
    private readonly categoryDataBase: Repository<Categories>,
  ) {}
  async getCategoryById(categoriesId: string) {
    return await this.categoryDataBase.find({
      where: { uuid: categoriesId },
    });
  }
}
