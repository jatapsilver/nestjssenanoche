import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService, DataLoaderUsers } from './app.service';
import { UsersModule } from './users/users.module';
import { CredentialsModule } from './credentials/credentials.module';
import { ProductsModule } from './products/products.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './config/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Credential } from './entities/credential.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('typeorm') ?? {},
    }),
    TypeOrmModule.forFeature([User, Credential]),
    UsersModule,
    CredentialsModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService, DataLoaderUsers],
})
export class AppModule {}
