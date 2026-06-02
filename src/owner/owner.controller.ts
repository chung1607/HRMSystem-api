import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
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

  @UseGuards(AuthGuard)
  @Get('team-members')
  getTeamMembers(
    @Req() req,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search = '',
  ) {
    return this.ownerService.getTeamMembers(
      req.user_data.id,
      Number(page),
      Number(limit),
      search,
    );
  }

  @UseGuards(AuthGuard)
  @Get('team-members/stats')
  getTeamMembersStats(@Req() req) {
    return this.ownerService.getTeamMembersStats(req.user_data.id);
  }

  @UseGuards(AuthGuard)
  @Get('team-members/:id')
  getMemberDetail(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.ownerService.getMemberDetail(req.user_data.id, id);
  }

  @UseGuards(AuthGuard)
  @Delete('team-members/:id')
  removeMember(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.ownerService.removeMember(req.user_data.id, id);
  }

  @UseGuards(AuthGuard)
  @Patch('team-members/:id/status')
  updateMemberStatus(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.ownerService.updateMemberStatus(req.user_data.id, id);
  }
}
