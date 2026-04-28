import { Module } from '@nestjs/common';
import { WorkLogsService } from './work-logs.service';
import { WorkLogsController } from './work-logs.controller';

@Module({
  providers: [WorkLogsService],
  controllers: [WorkLogsController]
})
export class WorkLogsModule {}
