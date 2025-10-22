import { Module } from '@nestjs/common';
import { CredentialsController } from './credentials.controller';
import { CredentialsService } from './credentials.service';
import { CredentialsRepository } from './credentials.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Credential } from 'src/entities/credential.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Credential])],
  controllers: [CredentialsController],
  providers: [CredentialsService, CredentialsRepository],
  exports: [TypeOrmModule],
})
export class CredentialsModule {}
