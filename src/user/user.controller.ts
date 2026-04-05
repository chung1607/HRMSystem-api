import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { extname } from 'path';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(
        private userService: UserService
    ) {}

    @UseGuards(AuthGuard)
    @ApiQuery({ name: 'page' })
    @ApiQuery({ name: 'items_per_page' })
    @ApiQuery({ name: 'search' })
    @Get()
    findAll(@Query() query: FilterUserDto): Promise<User[]> {
        // console.log(query);
        return this.userService.findAll(query);
    }
    
    @UseGuards(AuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string): Promise<User> {
        return this.userService.findOne(Number(id));
    }

    @UseGuards(AuthGuard)
    @Post()
    create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.userService.create(createUserDto);
    }

    @UseGuards(AuthGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(Number(id), updateUserDto);
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.userService.remove(Number(id));
    }

    @Post('upload-avatar')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('avatar', { storage: storageConfig('avatar'), 
        fileFilter: (req, file, cb) => {
            const ext = extname(file.originalname);
            const allowedExts = ['.jpg', '.jpeg', '.png', '.gif'];
            if(!allowedExts.includes(ext)) {
                req.fileValidationError = `Only image files are allowed: ${allowedExts.toString()}`;
                cb(null, false);
            }else {
                const filleSize = parseInt(req.headers['content-length']);
                if(filleSize > 5 * 1024 * 1024) {
                    req.fileValidationError = 'File size exceeds the limit of 5MB';
                    cb(null, false);
                }else {
                    cb(null, true);
                }
            }
        }
     }))
    uploadAvatar(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
        console.log(req.user_data);
        console.log(file);
        if(req.fileValidationError) {
            throw new BadRequestException(req.fileValidationError);
        }
        if(!file) {
            throw new BadRequestException('No file uploaded');
        }
        this.userService.updateAvatar(req.user_data.id, file.destination
            + '/' + file.filename);
    }
}
