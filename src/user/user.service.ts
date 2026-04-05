import { Injectable, Param } from '@nestjs/common';
import { User } from './entities/user.entity';
import { DeleteResult, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateResult } from 'typeorm/browser';
import { FilterUserDto } from './dto/filter-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>
    ) {}

    async findAll(query: FilterUserDto): Promise<any> {
        const items_per_page = Number(query.items_per_page) || 10;
        const page = Number(query.page) || 1;
        const skip = (page - 1) * items_per_page;
        const keywords = query.search || '';
        const[res, total] = await this.userRepository.findAndCount(
            {
                where: [
                    { username: Like('%' + keywords + '%') },
                    { phone: Like('%' + keywords + '%') },
                ],
                order: { created_at: 'DESC' },
                take: items_per_page,
                skip: skip,
                select: ['id', 'username', 'password', 'phone', 'role','is_verified', 'created_at', 'updated_at']
            }
        );
        const lastPage = Math.ceil(total / items_per_page);
        const nextPage = page + 1 > lastPage ? null : page + 1;
        const prevPage = page - 1 < 1 ? null : page - 1;

        return {
            data: res,
            total,
            currentPage: page,
            nextPage,
            prevPage,
            lastPage
        }
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

    async updateAvatar(id: number, avatar: string): Promise<UpdateResult> {
        return await this.userRepository.update(id, { avatar });
    }
}
