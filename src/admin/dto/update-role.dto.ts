import { IsEnum } from 'class-validator';
import { UserRole } from '../../user/entities/user.entity';

export class UpdateRoleDto {
  @IsEnum(UserRole)
  role: UserRole;
}