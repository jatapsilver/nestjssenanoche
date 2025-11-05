import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}
  @ApiOperation({ summary: 'Cargar Categorias por medio de un seed' })
  @ApiResponse({
    status: 200,
    description: 'Categorias cargadas exitosamente.',
  })
  @Get('seedCategory')
  seedCategory() {
    return this.seedService.seedCategoryService();
  }
}
