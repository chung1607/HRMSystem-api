import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Teams } from 'src/teams/entities/teams.entity';
import { Payment } from 'src/payments/entities/payments.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([User, Teams, Payment]), ConfigModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
