import { Module } from '@nestjs/common';
import { TeamMembersController } from './team_members.controller';
import { TeamMembersService } from './team_members.service';

@Module({
  controllers: [TeamMembersController],
  providers: [TeamMembersService]
})
export class TeamMembersModule {}
