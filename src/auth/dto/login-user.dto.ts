import { IsString, IsNotEmpty, ValidateIf, IsPhoneNumber } from 'class-validator';

export class LoginUserDto {
    @ValidateIf(o => !o.phone)
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @ValidateIf(o => !o.username)
    @IsPhoneNumber('VN')
    @IsNotEmpty()
    phone: string;
}