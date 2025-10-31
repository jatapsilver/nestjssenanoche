import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Credential } from 'src/entities/credential.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CredentialsRepository {
  constructor(
    @InjectRepository(Credential)
    private readonly credentialDataBase: Repository<Credential>,
  ) {}

  //metodo para obtener la credencial de un usuario por su username
  async getUserByUsername(username: string) {
    return await this.credentialDataBase.findOne({
      where: { username: username },
      relations: ['user_id'],
    });
  }
}
