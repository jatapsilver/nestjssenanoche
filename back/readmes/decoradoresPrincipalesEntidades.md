# Guía Rápida de Decoradores de Entidades (TypeORM + NestJS)

Esta guía resume los decoradores más usados al modelar entidades con TypeORM en un proyecto NestJS.

---

## 1. Decoradores a nivel de Clase (Tabla / Vista / Constraints)

| Decorador                    | Uso                             | Ejemplo                                     |
| ---------------------------- | ------------------------------- | ------------------------------------------- |
| `@Entity(name?)`             | Marca la clase como tabla       | `@Entity('users')`                          |
| `@ViewEntity(options?)`      | Define una vista (solo lectura) | `@ViewEntity({ expression: 'SELECT ...' })` |
| `@Unique([...campos])`       | Crea constraint UNIQUE          | `@Unique(['email'])`                        |
| `@Check('condición')`        | Constraint CHECK                | `@Check('"age" >= 0')`                      |
| `@Index([...campos], opts?)` | Crea índice simple o compuesto  | `@Index(['name','email'])`                  |

Notas:

- `@Entity()` sin nombre → tabla con nombre de la clase en minúsculas (ojo con palabras reservadas: user, order...).
- Puedes combinar `@Unique` y `@Index` para performance + integridad.

---

## 2. Decoradores de Identidad y Columnas

| Decorador                            | Descripción                                 | Notas                               |
| ------------------------------------ | ------------------------------------------- | ----------------------------------- |
| `@PrimaryGeneratedColumn(strategy?)` | PK autogenerada (`increment`, `uuid`, etc.) | Default: increment (int)            |
| `@PrimaryColumn()`                   | PK manual                                   | Útil para IDs naturales / externos  |
| `@Column(options?)`                  | Columna normal                              | Soporta muchas opciones (ver abajo) |
| `@Generated('uuid')`                 | Genera valores (uuid, increment, rowid)     | Usado con `@Column`                 |

### Opciones comunes de `@Column()`

```ts
@Column({
  type: 'varchar',   // int, bigint, boolean, date, timestamp, jsonb, enum, numeric...
  length: 255,       // para strings
  nullable: false,   // permite NULL
  unique: true,      // UNIQUE constraint
  default: 'Activo', // valor por defecto (o función SQL -> () => 'now()')
  name: 'user_name', // nombre físico en la tabla
  precision: 10,     // para numeric/decimal
  scale: 2,          // decimales
  enum: ['A','B'],   // enum inline
  update: true,      // si puede actualizarse
  select: true,      // si aparece en SELECT por defecto
})
```

---

## 3. Columnas Especiales (Audit / Soft Delete / Concurrencia)

| Decorador             | Función                         | Comentario               |
| --------------------- | ------------------------------- | ------------------------ |
| `@CreateDateColumn()` | Fecha creación                  | Se setea automáticamente |
| `@UpdateDateColumn()` | Fecha última actualización      | Auto-manage              |
| `@DeleteDateColumn()` | Soft delete (marca borrado)     | `NULL` = activo          |
| `@VersionColumn()`    | Versión para optimistic locking | Incrementa cada update   |

---

## 4. Relaciones

| Decorador                         | Relación               | Dónde va                          |
| --------------------------------- | ---------------------- | --------------------------------- |
| `@OneToOne(() => Target, inv?)`   | 1 ↔ 1                 | Lado que tenga `@JoinColumn`      |
| `@OneToMany(() => Target, inv)`   | 1 ↔ N                 | Lado NO propietario               |
| `@ManyToOne(() => Target, inv?)`  | N ↔ 1                 | Lado propietario (FK)             |
| `@ManyToMany(() => Target, inv?)` | N ↔ N                 | Ambos lados + `@JoinTable` en uno |
| `@JoinColumn(options?)`           | Define la FK explícita | OneToOne / ManyToOne              |
| `@JoinTable(options?)`            | Crea tabla intermedia  | Solo en un lado del ManyToMany    |

Opciones frecuentes en relaciones: `{ eager, cascade, onDelete, onUpdate, nullable }`

Recomendaciones:

- Evita `eager: true` en listas grandes.
- Usa `cascade: ['insert','update']` de forma intencional (cuidado con `remove`).

---

## 5. Otros Decoradores Útiles

| Decorador                                  | Uso                                           |
| ------------------------------------------ | --------------------------------------------- |
| `@Embedded(() => Tipo)`                    | Incrusta un objeto/valor (Value Object)       |
| `@RelationId((entity) => entity.relación)` | Accede directo al ID de una relación          |
| `@Index()`                                 | Índices adicionales (single/compound/partial) |

Índices parciales (Postgres) vía opción: `@Index('idx_active_email', ['email'], { where: 'deleted_at IS NULL' })`.

---

## 6. Ejemplo Completo

```ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  Unique,
  Index,
  VersionColumn,
} from 'typeorm';

@Entity('users')
@Unique(['email'])
@Index(['name', 'email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', unique: true, length: 150 })
  email: string;

  @Column({ type: 'enum', enum: ['active', 'inactive'], default: 'active' })
  status: string;

  @Column({ type: 'int', default: 0 })
  age: number;

  @Column({ type: 'boolean', default: true })
  isVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @VersionColumn()
  version: number;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
```

---

## 7. Resumen / Checklist Mental

- PK: `@PrimaryGeneratedColumn('uuid' | 'increment')` o `@PrimaryColumn` manual.
- Columnas: tipos correctos + constraints (`nullable`, `unique`, `default`).
- Fechas: `CreateDateColumn`, `UpdateDateColumn`, opcional `DeleteDateColumn`.
- Concurrencia: `@VersionColumn` si necesitas optimistic locking.
- Índices: para búsquedas frecuentes + compuestos para combinaciones.
- Relaciones: diseña cardinalidades y evita cascadas peligrosas.
- Enums: preferir `enum: MiEnum` (y no strings repetidos dispersos).
- Migraciones: GENERAR siempre en entornos serios (`synchronize: false`).

---

## 8. Buenas Prácticas y Pitfalls

| Tema        | Antipatrón                    | Recomendación                                |
| ----------- | ----------------------------- | -------------------------------------------- |
| synchronize | Activarlo en prod             | Solo local desarrollo inicial                |
| eager       | Usarlo en colecciones grandes | Usar joins controlados                       |
| cascade     | `cascade: true` sin pensar    | Especificar acciones necesarias              |
| enums       | Literales sueltos             | Centralizar en `enum` TS                     |
| índices     | No agregar                    | Monitorear consultas y añadir                |
| soft delete | Borrar físico siempre         | Usar `DeleteDateColumn` si histórico importa |
| naming      | Mezcla camel/snake            | Definir estrategia consistente               |

---

## 9. Extensiones / Extras

- Indexado parcial en Postgres para soft delete.
- Columnas JSONB para metadata flexible (`@Column({ type: 'jsonb', nullable: true })`).
- Estrategia de nombres (snake_case) → naming strategy personalizada.
- Auditoría avanzada → tablas de historial / triggers.
