import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(AuthGuard)
  @Get('charts/work-amount')
  getWorkAmountChart(@Req() req) {
    const ownerId = req.user_data.id;
    return this.dashboardService.getWorkAmountChart(ownerId);
  }

  @UseGuards(AuthGuard)
  @Get('charts/team-performance')
  getTeamPerformance(@Req() req) {
    const ownerId = req.user_data.id;
    return this.dashboardService.getTeamPerformance(ownerId);
  }

  @UseGuards(AuthGuard)
  @Get('charts/total-cane')
  getTotalCaneByDate(@Req() req) {
    const ownerId = req.user_data.id;
    return this.dashboardService.getTotalCaneByDate(ownerId);
  }
}
