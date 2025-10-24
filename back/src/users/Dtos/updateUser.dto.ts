import { CreateUserDto } from './createUser.dto';
import { PartialType } from '@nestjs/mapped-types';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class UpdateUserDto extends PartialType(CreateUserDto) {}
