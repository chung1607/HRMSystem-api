import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateTeamDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    invite_code?: string;
}