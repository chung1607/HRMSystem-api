import { IsOptional, IsString } from 'class-validator';

export class UpdateTeamDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  invite_code?: string;

  @IsOptional()
  status?: 'pending' | 'active' | 'rejected';
}
