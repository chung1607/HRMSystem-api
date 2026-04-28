import { Module } from '@nestjs/common';
import { WorkLogsItemsService } from './work-logs-items.service';
import { WorkLogsItemsController } from './work-logs-items.controller';

@Module({
  providers: [WorkLogsItemsService],
  controllers: [WorkLogsItemsController]
})
export class WorkLogsItemsModule {}
