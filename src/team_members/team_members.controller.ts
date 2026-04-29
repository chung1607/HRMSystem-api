import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JoinTeamDto } from './dto/join-team.dto';
import { TeamMembersService } from './team_members.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('team-members')
export class TeamMembersController {
  constructor(private readonly teamMembersService: TeamMembersService) {}
  
  @UseGuards(AuthGuard)
  @Post('join')
  joinTeam(@Req() req, @Body() dto: JoinTeamDto) {
    const userId = req.user_data.id;
    return this.teamMembersService.joinTeam(userId, dto);
  }
}
