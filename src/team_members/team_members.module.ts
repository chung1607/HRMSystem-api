import { Module } from '@nestjs/common';
import { TeamMembersController } from './team_members.controller';
import { TeamMembersService } from './team_members.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Teams } from 'src/teams/entities/teams.entity';
import { TeamMember } from './entities/team_members.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([User, Teams, TeamMember]), ConfigModule],
  controllers: [TeamMembersController],
  providers: [TeamMembersService],
})
export class TeamMembersModule {}
