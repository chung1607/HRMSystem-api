import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>
    ) {}

    async register(registerUserDto: RegisterUserDto): Promise<User> {
        const hashedPassword = await this.hashPassword(registerUserDto.password);
        return await this.userRepository.save({ ...registerUserDto, refresh_token: "refresh_token_string", password: hashedPassword });
    }

    private async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return await bcrypt.hash(password, salt);
    }
}
