import { Module } from '@nestjs/common';
import { WorkLogsService } from './work-logs.service';
import { WorkLogsController } from './work-logs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkLog } from './entities/work-logs.entity';
import { WorkLogItem } from 'src/work-logs-items/entities/work-logs-items.entity';
import { TeamMember } from 'src/team_members/entities/team_members.entity';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    TypeOrmModule.forFeature([WorkLog, WorkLogItem, TeamMember]),
    ConfigModule,
  ],
  providers: [WorkLogsService],
  controllers: [WorkLogsController],
})
export class WorkLogsModule {}
