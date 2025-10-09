# Guía de Relaciones en TypeORM (NestJS)

Esta guía explica de forma clara los tres tipos principales de relaciones entre entidades en TypeORM (usado comúnmente con NestJS): One-to-One, One-to-Many / Many-to-One y Many-to-Many. Incluye código, cómo se reflejan en la base de datos y buenas prácticas.

---

## 1. Relación Uno a Uno (One-to-One)

👉 Cada registro en una tabla se relaciona con un único registro en otra tabla (exclusividad mutua).

Ejemplo típico: Usuario ↔ Perfil (cada usuario tiene exactamente un perfil, cada perfil pertenece a un usuario).

```ts
// usuario.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Perfil } from './perfil.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  // Usuario TIENE un perfil (lado propietario si lleva @JoinColumn).
  // @JoinColumn coloca la FK en esta tabla (usuarios.perfilId)
  @OneToOne(() => Perfil, (perfil) => perfil.usuario)
  @JoinColumn()
  perfil: Perfil;
}
```

```ts
// perfil.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('perfiles')
export class Perfil {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bio: string;

  // Lado inverso (no propietario): NO lleva @JoinColumn
  @OneToOne(() => Usuario, (usuario) => usuario.perfil)
  usuario: Usuario;
}
```

📌 En la base de datos: La tabla `usuarios` tendrá una columna `perfilId` (FK → perfiles.id).

Variaciones:

- También puedes poner @JoinColumn en el otro lado si decides que la FK vive en `perfiles`.
- Para credenciales sensibles (User ↔ Credential) se suele NO hacer eager loading.

---

## 2. Relación Uno a Muchos / Muchos a Uno (One-to-Many / Many-to-One)

👉 Un registro A puede tener muchos B, pero cada B pertenece a un único A.

Ejemplo: Usuario ↔ Publicaciones (un usuario escribe muchas publicaciones; cada publicación pertenece a un usuario).

```ts
// usuario.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Publicacion } from './publicacion.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  // Lado inverso (no propietario). TypeORM creará la FK en la tabla de Publicacion
  @OneToMany(() => Publicacion, (publicacion) => publicacion.usuario)
  publicaciones: Publicacion[];
}
```

```ts
// publicacion.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('publicaciones')
export class Publicacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  // Lado propietario (la FK vive aquí -> publicaciones.usuarioId)
  @ManyToOne(() => Usuario, (usuario) => usuario.publicaciones)
  usuario: Usuario;
}
```

📌 En la base de datos: La tabla `publicaciones` tiene `usuarioId` como FK hacia `usuarios.id`.

Notas:

- El lado `@ManyToOne` es SIEMPRE el propietario y guarda la FK.
- El lado `@OneToMany` nunca lleva @JoinColumn.

---

## 3. Relación Muchos a Muchos (Many-to-Many)

👉 Muchos registros de A se relacionan con muchos registros de B. Se crea una tabla intermedia (join table).

Ejemplo: Estudiantes ↔ Cursos (un estudiante se inscribe en muchos cursos; un curso tiene muchos estudiantes).

```ts
// estudiante.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Curso } from './curso.entity';

@Entity('estudiantes')
export class Estudiante {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  // Lado propietario: define la join table
  @ManyToMany(() => Curso, (curso) => curso.estudiantes)
  @JoinTable({ name: 'estudiantes_cursos' }) // Tabla intermedia
  cursos: Curso[];
}
```

```ts
// curso.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Estudiante } from './estudiante.entity';

@Entity('cursos')
export class Curso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  // Lado inverso: no repite @JoinTable
  @ManyToMany(() => Estudiante, (estudiante) => estudiante.cursos)
  estudiantes: Estudiante[];
}
```

📌 En la base de datos: Se crea `estudiantes_cursos` con columnas `estudianteId` y `cursoId` (ambas FKs).

Customización avanzada de JoinTable:

```ts
@JoinTable({
  name: 'estudiantes_cursos',
  joinColumn: { name: 'estudiante_id', referencedColumnName: 'id' },
  inverseJoinColumn: { name: 'curso_id', referencedColumnName: 'id' },
})
```

---

## 4. Resumen Rápido de Propiedad (¿Dónde vive la FK?)

| Relación                  | Lado Propietario           | Decorador clave |
| ------------------------- | -------------------------- | --------------- |
| One-to-One                | El que tenga `@JoinColumn` | `@JoinColumn`   |
| One-to-Many / Many-to-One | El `ManyToOne`             | `@ManyToOne`    |
| Many-to-Many              | El que tenga `@JoinTable`  | `@JoinTable`    |

---

## 5. Buenas Prácticas

- Evita `eager: true` en relaciones con colecciones grandes (impacto de performance).
- Usa `cascade: ['insert','update']` solo si realmente quieres que se creen/actualicen hijos automáticamente.
- Para borrados lógicos usa `softRemove` / `DeleteDateColumn` en lugar de cascadas peligrosas.
- Indexa columnas FK si harás filtros/joins frecuentes.
- En Many-to-Many masivos (p.ej. usuarios-etiquetas) considera una entidad pivote explícita con datos extra (fecha, estado, etc.).

---

## 6. Errores Comunes

| Error                         | Causa                                        | Solución                                 |
| ----------------------------- | -------------------------------------------- | ---------------------------------------- |
| FK nula inesperada            | No guardaste primero el lado propietario     | Asegura orden o usa cascada controlada   |
| Duplicados en Many-to-Many    | Inserciones repetidas                        | Verifica existencia antes de push y save |
| Relación no cargada           | No usaste `relations` ni `leftJoinAndSelect` | Cargar explícitamente                    |
| Exposición de datos sensibles | eager en entidad con datos críticos          | Quitar eager y controlar proyección      |
| Rendimiento lento             | Many-to-Many gigante cargado eager           | Usa paginación o QueryBuilder            |

---

## 7. Diagramas Textuales

One-to-One:

```
Usuario ────1:1──── Perfil
(usuarios.perfilId FK → perfiles.id)
```

One-to-Many / Many-to-One:

```
Usuario 1 ────< Publicacion*
(publicaciones.usuarioId FK → usuarios.id)
```

Many-to-Many:

```
Estudiante >───< Curso
        \   /
   estudiantes_cursos (tabla intermedia)
```

---

## 8. Cheatsheet

| Objetivo          | Decoradores mínimos                                   |
| ----------------- | ----------------------------------------------------- |
| 1:1               | `@OneToOne` + `@JoinColumn` en un lado                |
| 1:N / N:1         | `@ManyToOne` (FK) + `@OneToMany` inverso              |
| N:N               | `@ManyToMany` + `@JoinTable` en un lado               |
| Join table custom | `@JoinTable({ name, joinColumn, inverseJoinColumn })` |
| Cargar relación   | `repo.find({ relations: { perfil: true } })`          |
| QueryBuilder join | `.leftJoinAndSelect('usuario.perfil','perfil')`       |

---

## 9. Ejemplo de Carga de Relaciones

```ts
// Cargar usuario con publicaciones y perfil
this.usuarioRepo.find({
  relations: { publicaciones: true, perfil: true },
});

// Usando QueryBuilder para filtrar
this.usuarioRepo
  .createQueryBuilder('u')
  .leftJoinAndSelect('u.publicaciones', 'p')
  .leftJoinAndSelect('u.perfil', 'pf')
  .where('u.id = :id', { id })
  .getOne();
```

---

## 10. Conclusión

Comprender el lado propietario (donde vive la FK) es clave para evitar frustraciones. Usa las relaciones de forma explícita, carga solo lo necesario y documenta las cardinalidades. Cuando la relación Many-to-Many necesite datos adicionales (ej. fecha de inscripción), conviértela en una entidad intermedia real.

---

✅ Resumen Final:

- One-to-One: exclusividad mutua → requiere `@JoinColumn` en un lado.
- One-to-Many / Many-to-One: la FK siempre está en el `ManyToOne`.
- Many-to-Many: tabla intermedia automática con `@JoinTable` (o explícita si necesitas datos extra).

¿Te genero ahora ejemplos adaptados con tus entidades reales (`User`, `Credential`, etc.) o quieres ampliar con relaciones polimórficas / self-join? Pídelo y lo añadimos.
