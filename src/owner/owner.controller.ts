import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { OwnerService } from './owner.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('owner')
export class OwnerController {
  constructor(private readonly ownerService: OwnerService) {}

  @UseGuards(AuthGuard)
  @Get('dashboard/stats')
  getDashboardStats(@Req() req) {
    return this.ownerService.getDashboardStats(req.user_data.id);
  }

  @UseGuards(AuthGuard)
  @Get('dashboard/cane-chart')
  getCaneChart(@Req() req, @Query('range') range: 'week' | 'month' | 'year') {
    return this.ownerService.getCaneChart(req.user_data.id, range);
  }

  @UseGuards(AuthGuard)
  @Get('dashboard/cane-type-chart')
  getCaneTypeChart(@Req() req) {
    return this.ownerService.getCaneTypeChart(req.user_data.id);
  }

  @UseGuards(AuthGuard)
  @Get('dashboard/top-workers')
  getTopWorkers(@Req() req) {
    return this.ownerService.getTopWorkers(req.user_data.id);
  }

  @UseGuards(AuthGuard)
  @Get('dashboard/recent-work-logs')
  getRecentWorkLogs(@Req() req) {
    return this.ownerService.getRecentWorkLogs(req.user_data.id);
  }
}
