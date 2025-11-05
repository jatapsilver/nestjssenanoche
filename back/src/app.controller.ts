import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('General')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: 'Esta ruta es la entrada principal a nuestro back',
  })
  @ApiResponse({
    status: 200,
    description: 'Devuelve un mensaje de bienvenida',
    schema: {
      example: 'Ejemplo de mensaje de bienvenida',
    },
  })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
