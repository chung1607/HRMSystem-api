import { Injectable, Param } from '@nestjs/common';
import { User } from './entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateResult } from 'typeorm/browser';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>
    ) {}

    async findAll(): Promise<User[]> {
        return this.userRepository.find(
            {
                select: ['id', 'username', 'password', 'phone', 'role','is_verified', 'created_at', 'updated_at']
            }
        );
    }

    async findOne(@Param('id') id: number): Promise<User> {
        return this.userRepository.findOneBy({id});
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        createUserDto.password = hashedPassword;
        return await this.userRepository.save(createUserDto);
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
        return await this.userRepository.update(id, updateUserDto);
    }

    async remove(id: number): Promise<DeleteResult> {
        return await this.userRepository.delete(id);
    }
}
