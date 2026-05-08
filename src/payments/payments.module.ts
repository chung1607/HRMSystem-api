import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payments.entity';
import { TeamMember } from 'src/team_members/entities/team_members.entity';
import { WorkLogItem } from 'src/work-logs-items/entities/work-logs-items.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, TeamMember, WorkLogItem]),
    ConfigModule,
  ],
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
