# 📚 Guía de Migraciones con TypeORM en NestJS

## 📋 Tabla de Contenidos

- [¿Qué son las Migraciones?](#qué-son-las-migraciones)
- [Configuración Inicial](#configuración-inicial)
- [Comandos Principales](#comandos-principales)
- [Flujo de Trabajo Recomendado](#flujo-de-trabajo-recomendado)
- [Ejemplos Prácticos](#ejemplos-prácticos)
- [Mejores Prácticas](#mejores-prácticas)
- [Solución de Problemas](#solución-de-problemas)

---

## ¿Qué son las Migraciones?

Las **migraciones** son scripts que permiten versionar y controlar los cambios en la estructura de tu base de datos. Son como un "Git para tu base de datos".

### Ventajas:

✅ Control de versiones de la base de datos  
✅ Sincronización entre entornos (desarrollo, producción)  
✅ Historial de cambios documentado  
✅ Rollback en caso de errores  
✅ Trabajo en equipo más organizado

---

## 📦 Configuración Inicial

### 1. Instalar Dependencias

```bash
npm install typeorm ts-node @types/node --save-dev
```

### 2. Crear Archivo de Configuración para Migraciones

Utilizaremos nuestro archivo `typeorm.ts` en la carpeta config:

```typescript
import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env.development' });

const config: DataSourceOptions = {
  type: 'postgres',
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  entities: ['src/entities/**/*.entity.ts'],
  migrations: ['src/migrations/**/*.ts'],
  logging: true,
  synchronize: false,
  dropSchema: false,
  migrationsTableName: 'migrations_history',
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config);
```

### 3. Actualizar package.json

Agrega estos scripts en tu `package.json`:

```json
{
  "scripts": {
    "typeorm": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js -d src/config/typeorm.ts",
    "migration:generate": "npm run typeorm -- migration:generate",
    "migration:create": "npm run typeorm -- migration:create",
    "migration:run": "npm run typeorm -- migration:run",
    "migration:revert": "npm run typeorm -- migration:revert",
    "migration:show": "npm run typeorm -- migration:show"
  }
}
```

### 4. Instalar tsconfig-paths

```bash
npm install tsconfig-paths --save-dev
```

---

## 🛠️ Comandos Principales

### Generar una Migración Automáticamente

TypeORM compara tus entidades con la base de datos y genera los cambios necesarios:

```bash
npm run migration:generate -- src/migrations/InitialMigration
```

### Crear una Migración Vacía (Manual)

Para crear cambios personalizados:

```bash
npm run migration:create -- src/migrations/AddCustomIndex
```

### Ejecutar Migraciones Pendientes

Aplica todas las migraciones que no se han ejecutado:

```bash
npm run migration:run
```

### Revertir la Última Migración

Deshace la última migración ejecutada:

```bash
npm run migration:revert
```

### Ver Estado de las Migraciones

Muestra qué migraciones están ejecutadas y cuáles no:

```bash
npm run migration:show
```

---

## 🔄 Flujo de Trabajo Recomendado

### Opción 1: Desarrollo Inicial (Desde Cero)

```bash
# 1. Desactivar synchronize en tu configuración de TypeORM
# En config/typeorm.ts o app.module.ts, establece: synchronize: false

# 2. Generar migración inicial con todas las entidades actuales
npm run migration:generate -- src/migrations/InitialSchema

# 3. Revisar el archivo generado en src/migrations/

# 4. Ejecutar la migración
npm run migration:run

# 5. Verificar que se aplicó correctamente
npm run migration:show
```

### Opción 2: Agregar Nuevas Entidades o Modificar Existentes

```bash
# 1. Crear o modificar tus entidades en src/entities/

# 2. Generar migración automática con los cambios
npm run migration:generate -- src/migrations/AddProductCategory

# 3. Revisar la migración generada

# 4. Ejecutar la migración
npm run migration:run
```

---

## 📝 Ejemplos Prácticos

### Ejemplo 1: Migración Inicial del E-commerce

```bash
# Paso 1: Crear carpeta para migraciones
mkdir -p src/migrations

# Paso 2: Generar migración inicial
npm run migration:generate -- src/migrations/InitialEcommerceSchema

# Paso 3: Ejecutar migración
npm run migration:run
```

**Entidades incluidas:**

- ✅ User (usuarios.entity.ts)
- ✅ Credential (credential.entity.ts)
- ✅ Products (product.entity.ts)
- ✅ Category (cateogires.entity.ts)
- ✅ Order (orders.entity.ts)
- ✅ OrderDetail (orders_detail.entity.ts)
- ✅ File (file.entity.ts)

### Ejemplo 2: Agregar Nueva Columna a Producto

```typescript
// En product.entity.ts, agregar:
@Column({ type: 'varchar', length: 50, nullable: true })
brand: string;
```

```bash
# Generar migración con el cambio
npm run migration:generate -- src/migrations/AddBrandToProduct

# Ejecutar
npm run migration:run
```

### Ejemplo 3: Crear Índice Personalizado

```bash
# Crear migración vacía
npm run migration:create -- src/migrations/AddIndexToProductName
```

Editar el archivo generado:

```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexToProductName1699123456789 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_PRODUCT_NAME" ON "products" ("name")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_PRODUCT_NAME"`);
  }
}
```

```bash
npm run migration:run
```

---

## ✅ Mejores Prácticas

### 1. Naming Conventions (Nomenclatura)

```bash
# ✅ Buenos nombres
npm run migration:generate -- src/migrations/CreateUsersTable
npm run migration:generate -- src/migrations/AddEmailToUser
npm run migration:generate -- src/migrations/CreateProductCategoryRelation

# ❌ Malos nombres
npm run migration:generate -- src/migrations/Migration1
npm run migration:generate -- src/migrations/UpdateDb
```

### 2. Revisar Siempre las Migraciones Generadas

Antes de ejecutar `migration:run`, revisa el archivo generado para:

- Verificar que los cambios son correctos
- Asegurar que no hay DROP de tablas accidentales
- Confirmar que las relaciones están bien definidas

### 3. Control de Versiones

```bash
# Agregar las migraciones a Git
git add src/migrations/
git commit -m "feat: add initial database migrations"
```

### 4. Sincronización entre Entornos

```bash
# En desarrollo
npm run migration:run

# En producción (mismo comando)
npm run migration:run
```

### 5. Backups Antes de Migraciones en Producción

```bash
# Hacer backup de la base de datos antes de ejecutar migraciones
pg_dump -U usuario -d database_name > backup_$(date +%Y%m%d_%H%M%S).sql

# Luego ejecutar migraciones
npm run migration:run
```

---

## 🚨 Solución de Problemas

### Error: "synchronize is enabled"

**Problema:** TypeORM está en modo sincronización automática.

**Solución:**

```typescript
// En tu configuración de TypeORM
TypeOrmModule.forRoot({
  // ...
  synchronize: false, // ⚠️ Cambiar a false
});
```

### Error: "No changes in database schema were found"

**Problema:** No hay diferencias entre entidades y base de datos.

**Solución:**

- Verifica que realmente hiciste cambios en las entidades
- Asegúrate de que las entidades estén en el path correcto
- Revisa que `typeorm.ts` apunte a las entidades correctas

### Error: "QueryFailedError"

**Problema:** La migración tiene errores SQL.

**Solución:**

```bash
# Revertir la última migración
npm run migration:revert

# Corregir el archivo de migración
# Volver a ejecutar
npm run migration:run
```

### Migración Ejecutada Pero Incompleta

```bash
# Ver el estado
npm run migration:show

# Revertir
npm run migration:revert

# Corregir y volver a ejecutar
npm run migration:run
```

---

## 📊 Estructura de Archivos de Migraciones

```
src/
├── migrations/
│   ├── 1699123456789-InitialEcommerceSchema.ts
│   ├── 1699123567890-AddBrandToProduct.ts
│   └── 1699123678901-CreateIndexProductName.ts
├── entities/
│   ├── users.entity.ts
│   ├── credential.entity.ts
│   ├── product.entity.ts
│   ├── cateogires.entity.ts
│   ├── orders.entity.ts
│   ├── orders_detail.entity.ts
│   └── file.entity.ts
└── config/
    └── typeorm.ts
```

---

## 🎯 Workflow Completo de Ejemplo

```bash
# 1. Configuración inicial (una sola vez)
npm install typeorm ts-node @types/node tsconfig-paths --save-dev

# 2. Crear ormconfig.ts en la raíz del proyecto

# 3. Actualizar package.json con scripts

# 4. Desactivar synchronize en la configuración de TypeORM

# 5. Generar migración inicial
npm run migration:generate -- src/migrations/InitialEcommerceSchema

# 6. Revisar archivo generado en src/migrations/

# 7. Ejecutar migración
npm run migration:run

# 8. Verificar
npm run migration:show

# 9. Para futuros cambios: modificar entidades y repetir pasos 5-8
```

---

## 📚 Recursos Adicionales

- [Documentación oficial de TypeORM Migrations](https://typeorm.io/migrations)
- [NestJS Database Documentation](https://docs.nestjs.com/techniques/database)
- [TypeORM CLI Commands](https://typeorm.io/using-cli)

---

## 🔐 Consideraciones de Seguridad

### Variables de Entorno (.env)

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password_seguro
DB_NAME=ecommerce_db
```

### .gitignore

```
.env
.env.local
.env.production
ormconfig.json
```

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs de TypeORM (con `logging: true`)
2. Verifica la conexión a la base de datos
3. Asegúrate de que todas las dependencias están instaladas
4. Revisa que las rutas en `typeorm.ts` sean correctas

---

**¡Buena suerte con tus migraciones! 🚀**
