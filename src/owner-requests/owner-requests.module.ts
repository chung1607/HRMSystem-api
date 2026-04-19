import { Module } from '@nestjs/common';
import { OwnerRequestsService } from './owner-requests.service';
import { OwnerRequestsController } from './owner-requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OwnerRequest } from './entities/owner_request.entity';
import { User } from 'src/user/entities/user.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([OwnerRequest, User]),
    ConfigModule
  ],
  providers: [OwnerRequestsService],
  controllers: [OwnerRequestsController]
})
export class OwnerRequestsModule {}
