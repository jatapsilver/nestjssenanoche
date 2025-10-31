import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { RolesEnum } from 'src/enums/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RolesEnum[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );
    console.log('Roles requeridos para esta ruta:', requiredRoles);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unused-vars
    const payload = request.user;
    console.log('Payload del usuario en el guard de roles:', payload);

    const hasRole = () =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      requiredRoles.some((role) => payload?.role.includes(role));

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const validate = payload && payload.role && hasRole();

    console.log('Validacion de roles en el guard:', validate);
    if (!validate) {
      throw new ForbiddenException(
        'No tienes permisos para acceder a este contenido',
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return validate;
  }
}
