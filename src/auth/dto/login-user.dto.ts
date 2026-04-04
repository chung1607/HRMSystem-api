import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, ValidateIf, IsPhoneNumber } from 'class-validator';

export class LoginUserDto {
    @ApiProperty()
    @ValidateIf(o => !o.phone)
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty()
    @ValidateIf(o => !o.username)
    @IsPhoneNumber('VN')
    @IsNotEmpty()
    phone: string;
}