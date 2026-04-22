import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Teams } from 'src/teams/entities/teams.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Teams])
  ],
  providers: [AdminService],
  controllers: [AdminController]
})
export class AdminModule {}
