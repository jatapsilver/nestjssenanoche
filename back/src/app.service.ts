import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';
import { Credential } from './entities/credential.entity';
import * as path from 'path';
import * as fs from 'fs';
import { RolesEnum } from './enums/roles.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hola sena mujeres digitales';
  }
}

@Injectable()
export class DataLoaderUsers implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userDataBase: Repository<User>,
    @InjectRepository(Credential)
    private readonly credentialDataBase: Repository<Credential>,
  ) {}

  async onModuleInit() {
    const userCount = await this.userDataBase.count();

    if (userCount === 0) {
      console.log('Cargando usuario iniciales...');
      const queryRunner =
        this.userDataBase.manager.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        const filePath = path.resolve(__dirname, '..', 'utils', 'data.json');
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const users = JSON.parse(rawData) as Array<{
          username: string;
          password: string;
          name: string;
          lastName: string;
          dni: string;
          email: string;
          phone: string;
          birthDate: string;
          roles: string;
        }>;

        await Promise.all(
          users.map(async (user) => {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            const newCredential = this.credentialDataBase.create({
              username: user.username,
              password: hashedPassword,
              roles: user.roles as RolesEnum,
            });
            await queryRunner.manager.save(newCredential);

            const newUser = this.userDataBase.create({
              name: user.name,
              lastName: user.lastName,
              dni: user.dni,
              email: user.email,
              phone: user.phone,
              birthDate: user.birthDate,
              credential_id: newCredential,
            });
            await queryRunner.manager.save(newUser);
          }),
        );
        await queryRunner.commitTransaction();
        console.log('Usuarios precargados correctamente');
      } catch (error) {
        console.error('Error al precargar usuarios:', error);
        await queryRunner.rollbackTransaction();
      } finally {
        await queryRunner.release();
      }
    } else {
      console.log('Los usuarios ya existen en la base de datos ');
    }
  }
}
