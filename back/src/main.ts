import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGlobal } from './middlewares/loggerGlobal';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(loggerGlobal);
  await app.listen(3002);
  console.log('🚀🚀 Servidor corriendo en el puerto 3002');
}
bootstrap();
