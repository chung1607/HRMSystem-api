import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { WorkLogsService } from './work-logs.service';
import { CreateWorkLogDto } from './dto/create-work-log.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('work-logs')
export class WorkLogsController {
  constructor(private readonly workLogsService: WorkLogsService) {}
  @UseGuards(AuthGuard)
  @Post()
  create(@Req() req, @Body() dto: CreateWorkLogDto) {
    const ownerId = req.user_data.id;
    return this.workLogsService.createWorkLog(ownerId, dto);
  }
}
