import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateUserRoleDto {
  @IsEnum(Role, { message: 'Role must be ADMIN or MANAGER' })
  role: Role;
}

export class UpdateUserStatusDto {
  @IsBoolean()
  isActive: boolean;
}

export class CreateUserByAdminDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}

export class UpdateProjectStatusDto {
  @IsEnum(['ACTIVE', 'INACTIVE'])
  status: 'ACTIVE' | 'INACTIVE';
}
