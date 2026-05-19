import { Module } from '@nestjs/common';
import { OwnerSubscriptionsController } from './owner-subscriptions.controller';
import { OwnerSubscriptionsService } from './owner-subscriptions.service';
import { Teams } from '../teams/entities/teams.entity';
import { OwnerSubscription } from './entities/owner_subscriptions.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OwnerSubscription, Teams, User]),
    ConfigModule,
  ],
  controllers: [OwnerSubscriptionsController],
  providers: [OwnerSubscriptionsService],
})
export class OwnerSubscriptionsModule {}
