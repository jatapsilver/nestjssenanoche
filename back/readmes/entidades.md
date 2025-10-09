# Guía de Entidades con TypeORM + Postgres en NestJS

Este README resume conceptos clave, ejemplos y buenas prácticas para modelar entidades, relaciones, migraciones y uso de repositorios con TypeORM y Postgres en NestJS.

## 1) Preparación

- Paquetes
  - `@nestjs/typeorm`, `typeorm`, `pg`
- Variables de entorno sugeridas
  - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`
- Configuración
  - `ConfigModule.forRoot({ isGlobal: true, load: [typeorm] })`
  - `TypeOrmModule.forRootAsync({ useFactory: (config) => config.get('typeorm') })`
- Entidades en producción
  - Apunta a `.js` en `dist` (p. ej. `dist/**/*.entity{.ts,.js}`) para que el runtime encuentre las clases compiladas.

---

## 2) Definiendo entidades

```ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' }) // nombre de la tabla
@Index(['email'], { unique: true }) // índice/único a nivel entidad
export class User {
  @PrimaryGeneratedColumn('uuid') // pk UUID (habitual en apps distribuidas)
  id: string;

  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Column({ type: 'varchar', length: 180, unique: true })
  email: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

Tipos comunes en Postgres: `varchar`, `text`, `int`, `bigint`, `numeric`, `boolean`, `date`, `timestamp`, `json/jsonb`, `uuid`.

### Enums

```ts
export enum Role { ADMIN = 'ADMIN', USER = 'USER' }

@Column({ type: 'enum', enum: Role, default: Role.USER })
role: Role;
```

### UUID por defecto

- `@PrimaryGeneratedColumn('uuid')` suele ser suficiente; si necesitas default explícito en migración:
  - `uuid-ossp`: `default: () => 'uuid_generate_v4()'`
  - `pgcrypto`: `default: () => 'gen_random_uuid()'`

---

## 3) Relaciones

### OneToMany / ManyToOne

```ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) // FK explícita
  owner: User;
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Product, (product) => product.owner)
  products: Product[];
}
```

### OneToOne

```ts
@OneToOne(() => Profile, { cascade: true, eager: true })
@JoinColumn({ name: 'profile_id' })
profile: Profile;
```

### ManyToMany

```ts
@ManyToMany(() => Tag, (tag) => tag.products, { cascade: true })
@JoinTable({ name: 'products_tags' }) // tabla pivote
tags: Tag[];
```

Opciones útiles: `cascade` (insert/update/remove), `eager` (carga automática), `onDelete`/`onUpdate`.

- Evita `eager` por defecto en relaciones grandes; usa `relations` o QueryBuilder al consultar.

---

## 4) Registrar entidades y usar repositorios

```ts
// users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { Product } from './product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Product])], // expone repositorios
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

```ts
// users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(Product)
    private readonly productsRepo: Repository<Product>,
  ) {}

  findAll() {
    return this.usersRepo.find({ relations: { products: true } });
  }

  create(data: Partial<User>) {
    const entity = this.usersRepo.create(data);
    return this.usersRepo.save(entity);
  }
}
```

---

## 5) QueryBuilder y paginación

```ts
this.usersRepo
  .createQueryBuilder('u')
  .leftJoinAndSelect('u.products', 'p')
  .where('u.isActive = :active', { active: true })
  .orderBy('u.createdAt', 'DESC')
  .skip((page - 1) * limit)
  .take(limit)
  .getMany();
```

- `skip` + `take` funciona; para volúmenes grandes, considera paginación por cursor (ID/fecha) + índices.

---

## 6) Transacciones

```ts
await this.dataSource.transaction(async (manager) => {
  const user = manager.create(User, dto);
  await manager.save(user);
  // más operaciones atómicas...
});
```

- Si necesitas control fino (locks, múltiples pasos), usa `QueryRunner`.

---

## 7) Soft deletes (borrado lógico)

```ts
import { DeleteDateColumn } from 'typeorm';

@DeleteDateColumn()
deletedAt?: Date;

// Borrar lógicamente
await repo.softRemove(entity);
// Restaurar
await repo.recover(entity);
// Por defecto, find no devuelve borrados
```

---

## 8) Migraciones (imprescindible en producción)

- Por qué: `synchronize: false` + migraciones → cambios controlados de esquema.
- Flujo: ajusta entidades → genera migración → revisa → aplica.

Comandos típicos (adáptalos a tu setup):

```bash
# Generar (después de compilar si apuntas a dist)
npx typeorm migration:generate ./dist/migrations/Init -d ./dist/src/config/typeorm.js

# Ejecutar
npx typeorm migration:run -d ./dist/src/config/typeorm.js

# Revertir
npx typeorm migration:revert -d ./dist/src/config/typeorm.js
```

Requisitos:

- Exportar `connectionSource` desde tu config TypeORM.
- Patrón correcto de migraciones: `['dist/migrations/*{.ts,.js}']`.

---

## 9) Índices, únicos y constraints

- A nivel columna:

```ts
@Column({ unique: true })
email: string;
```

- A nivel entidad:

```ts
@Index(['firstName', 'lastName'], { unique: true })
```

- Índices parciales en Postgres: `@Index({ where: "deleted_at IS NULL" })` útil para uniqueness con soft delete.

---

## 10) Estrategia de nombres y JSONB

- Estrategia de nombres snake_case: `typeorm-naming-strategies` o `NamingStrategy` propia (columnas, claves foráneas, índices).
- JSON/JSONB:

```ts
@Column({ type: 'jsonb', nullable: true })
metadata?: Record<string, any>;
```

---

## 11) Validación y DTOs

- No mezcles validación en entidades.
- Usa DTOs + `class-validator`/`class-transformer` en controladores/servicios:
  - `@IsEmail()`, `@IsString()`, etc.
  - `@UsePipes(new ValidationPipe({ transform: true }))`

---

## 12) Buenas prácticas y pitfalls

- No uses `synchronize: true` en producción.
- Evita `eager: true` salvo en relaciones pequeñas/estrictamente necesarias.
- Define índices para filtros y ordenaciones frecuentes.
- Cuidado con `cascade: true` en ManyToMany.
- Asegura rutas de entities/migrations a `.js` en `dist` para producción.
- En tests: usa SQLite o un contenedor Postgres dedicado; configura un `forRootAsync` de test.

---

## 13) Checklist rápida

- [ ] Entidades con tipos correctos y timestamps (`CreateDateColumn`, `UpdateDateColumn`).
- [ ] Relaciones con `onDelete/onUpdate` adecuados.
- [ ] Índices/únicos en campos clave.
- [ ] Migraciones generadas y aplicadas (prod: NUNCA `synchronize: true`).
- [ ] Repositorios inyectados con `TypeOrmModule.forFeature([...])`.
- [ ] Paginación/consultas con QueryBuilder cuando haga falta.
- [ ] DTOs + validación en los endpoints.

---
