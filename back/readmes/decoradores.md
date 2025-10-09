# Guía rápida de decoradores en NestJS (Cheat Sheet)

Este documento es educativo: resume los decoradores más usados en NestJS con explicaciones y mini‑ejemplos.

Índice

- 1. Módulos y configuración (`@Module`, `@Global`)
- 2. Controladores y rutas (`@Controller`, `@Get`/`@Post`/..., y decoradores de parámetros)
- 3. Respuestas HTTP (`@HttpCode`, `@Header`, `@Redirect`, `@Render`, `@Version`, `@Sse`)
- 4. Proveedores e Inyección de Dependencias (`@Injectable`, `@Inject`, `@Optional`, `@Scope`)
- 5. Guards, Interceptors, Pipes y Filters (`@UseGuards`, `@UseInterceptors`, `@UsePipes`, `@UseFilters`, `@Catch`)
- 6. Metadatos y decoradores personalizados (`@SetMetadata`, `createParamDecorator`)
- 7. WebSockets (`@WebSocketGateway`, `@WebSocketServer`, `@SubscribeMessage`)
- 8. Microservicios (`@MessagePattern`, `@EventPattern`, `@Payload`, `@Ctx`)
- 9. Tareas programadas (`@Cron`, `@Interval`, `@Timeout`)
- 10. Caché y subida de archivos (`@CacheKey`, `@CacheTTL`, `FileInterceptor`, `@UploadedFile`/`@UploadedFiles`)

> Nota: Los ejemplos son mínimos para ilustrar el uso. Adapta tipos, DTOs y dependencias a tu proyecto.

---

## 1) Módulos y configuración

```ts
import { Module, Global } from '@nestjs/common';

@Global() // Hace el módulo global: sus providers estarán disponibles sin importarlo en otros módulos
@Module({
  imports: [], // otros módulos que este módulo necesita
  controllers: [], // controladores que pertenecen a este módulo
  providers: [], // providers (servicios, repos, etc.) registrados en este módulo
  exports: [], // qué providers expone a otros módulos
})
export class SharedModule {}
```

---

## 2) Controladores y rutas

```ts
import { Controller, Get, Post, Put, Patch, Delete } from '@nestjs/common';

@Controller('users') // prefijo de ruta: /users
export class UsersController {
  @Get() // GET /users
  findAll() {}

  @Get(':id') // GET /users/123
  findOne() {}

  @Post() // POST /users
  create() {}

  @Put(':id') // PUT /users/123 (reemplazo total)
  replace() {}

  @Patch(':id') // PATCH /users/123 (actualización parcial)
  update() {}

  @Delete(':id') // DELETE /users/123
  remove() {}
}
```

### Decoradores de parámetros de ruta y request

```ts
import { Param, Query, Body, Headers, Req, Res, Next, HostParam, Ip, Session } from '@nestjs/common';

@Get(':id')
handler(
  // @Param('id') id: string, // parámetro de ruta
  // @Query('page') page?: number, // query string (?page=2)
  // @Body() payload?: any, // cuerpo del request
  // @Headers('authorization') auth?: string, // header específico
  // @Req() req?: Request, // objeto Request (Express/Fastify)
  // @Res() res?: Response, // objeto Response (desactiva respuesta automática)
  // @Next() next?: Function, // siguiente middleware
  // @HostParam('subdomain') sub?: string, // parámetro del host
  // @Ip() ip?: string, // IP del cliente
  // @Session() session?: Record<string, any>, // sesión (si está configurada)
) {}
```

---

## 3) Respuestas HTTP

```ts
import { HttpCode, Header, Redirect, Render, Version, Sse } from '@nestjs/common';
import { Observable, interval, map } from 'rxjs';

@Post()
@HttpCode(201) // cambia el status code por defecto
@Header('X-Custom', 'demo') // añade un header a la respuesta
create() {}

@Get('google')
@Redirect('https://google.com', 302) // redirección
goToGoogle() {}

@Get('view')
@Render('users') // renderiza una vista con un template engine
viewUsers() { return { users: [] }; }

@Get('v1')
@Version('1') // versionado de rutas
getV1() { return 'v1'; }

@Get('stream')
@Sse() // Server-Sent Events
stream(): Observable<MessageEvent> {
  return interval(1000).pipe(map((i) => ({ data: { tick: i } } as MessageEvent)));
}
```

---

## 4) Proveedores e Inyección de Dependencias

```ts
import { Injectable, Inject, Optional, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.DEFAULT }) // DEFAULT | REQUEST | TRANSIENT
export class UsersService {
  constructor(
    @Inject('USERS_REPO') // token de provider
    @Optional() // marca la dependencia como opcional
    private readonly repo?: any,
  ) {}
}
```

---

## 5) Guards, Interceptors, Pipes y Filters

```ts
import {
  UseGuards,
  UseInterceptors,
  UsePipes,
  UseFilters,
  Catch,
  ArgumentsHost,
  ExceptionFilter,
} from '@nestjs/common';

@UseGuards(AuthGuard) // guarda a nivel de controlador o handler
@UseInterceptors(LoggingInterceptor) // interceptores para logging, mapping, etc.
@UsePipes(ValidationPipe) // valida DTOs y transforma tipos
@UseFilters(AllExceptionsFilter) // maneja excepciones
@Controller('secure')
export class SecureController {
  @Get()
  @UseGuards(RoleGuard) // a nivel de método
  secure() {}
}

@Catch(HttpException) // filter de excepciones: captura tipos específicos
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // manejar la excepción y responder
  }
}
```

### Pipes por parámetro

```ts
import { ParseIntPipe, DefaultValuePipe } from '@nestjs/common';

@Get(':id')
getById(@Param('id', ParseIntPipe) id: number) {}

@Get()
find(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number) {}
```

---

## 6) Metadatos y decoradores personalizados

```ts
import { SetMetadata, createParamDecorator, ExecutionContext } from '@nestjs/common';

// Metadatos personalizados: útiles con guards/interceptors
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

// Decorador de parámetro personalizado
export const UserAgent = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.headers['user-agent'];
});

@Get('profile')
@Roles('admin')
getProfile(@UserAgent() ua: string) {}
```

---

## 7) WebSockets

```ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway {
  @WebSocketServer() server: Server; // instancia del server WS

  @SubscribeMessage('message') // escucha eventos del cliente
  handleMessage(
    @MessageBody() payload: any,
    @ConnectedSocket() client: Socket,
  ) {
    this.server.emit('message', payload);
  }
}
```

---

## 8) Microservicios

```ts
import {
  MessagePattern,
  EventPattern,
  Payload,
  Ctx,
  RmqContext,
} from '@nestjs/microservices';

export class OrdersController {
  @MessagePattern('get_order') // request/response pattern
  getOrder(@Payload() data: any, @Ctx() context: RmqContext) {
    // ...
  }

  @EventPattern('order_created') // fire-and-forget event
  handleOrderCreated(@Payload() data: any) {
    // ...
  }
}
```

---

## 9) Tareas programadas (Schedule)

```ts
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';

export class TasksService {
  @Cron(CronExpression.EVERY_MINUTE)
  handleCron() {}

  @Interval(5000)
  handleInterval() {}

  @Timeout(10000)
  handleTimeout() {}
}
```

---

## 10) Caché y subida de archivos

```ts
import { CacheTTL, CacheKey, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Get('cached')
@CacheKey('users:list') // clave de cache personalizada
@CacheTTL(60) // TTL en segundos
getCached() {}

@Post('upload')
@UseInterceptors(FileInterceptor('file')) // single file
uploadSingle(@UploadedFile() file: Express.Multer.File) {}

@Post('uploads')
@UseInterceptors(FilesInterceptor('files')) // multiple files
uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {}
```

---

### Notas finales

- NestJS posee más decoradores en paquetes como `@nestjs/graphql`, `@nestjs/swagger`, `@nestjs/passport`, etc.
- Usa `@UsePipes(new ValidationPipe({ transform: true }))` para mapear tipos de forma automática a tus DTOs.
- Evita usar `@Res()` manual salvo que necesites control absoluto de la respuesta.
