import { Module } from '@nestjs/common';
import { OwnerController } from './owner.controller';
import { OwnerService } from './owner.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teams } from '../teams/entities/teams.entity';
import { TeamMember } from '../team_members/entities/team_members.entity';
import { WorkLogItem } from '../work-logs-items/entities/work-logs-items.entity';
import { OwnerSubscription } from '../owner-subscriptions/entities/owner_subscriptions.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Teams,
      TeamMember,
      WorkLogItem,
      OwnerSubscription,
    ]),
    ConfigModule,
  ],
  controllers: [OwnerController],
  providers: [OwnerService],
})
export class OwnerModule {}
