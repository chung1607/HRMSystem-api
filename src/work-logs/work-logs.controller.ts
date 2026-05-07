import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
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

  @UseGuards(AuthGuard)
  @Get('summary/members')
  getMembersSummary(@Req() req) {
    const ownerId = req.user_data.id;
    return this.workLogsService.getMembersSummary(ownerId);
  }

  @UseGuards(AuthGuard)
  @Get('summary/member/:teamMemberId')
  getMemberSummary(@Req() req, @Param('teamMemberId', ParseIntPipe) teamMemberId: number) {
    const ownerId = req.user_data.id;
    return this.workLogsService.getMemberSummary(ownerId, teamMemberId);
  }
}
