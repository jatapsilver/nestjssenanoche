import { Module } from '@nestjs/common';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categories } from 'src/entities/categories.entity';
import { SeedRepository } from './seed.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Categories])],
  controllers: [SeedController],
  providers: [SeedService, SeedRepository],
})
export class SeedModule {}
