import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JoinTeamDto } from './dto/join-team.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { TeamMember } from './entities/team_members.entity';
import { Teams } from 'src/teams/entities/teams.entity';

@Injectable()
export class TeamMembersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(TeamMember)
    private readonly teamMemberRepository: Repository<TeamMember>,
    @InjectRepository(Teams)
    private readonly teamRepository: Repository<Teams>,
  ) {}
  async joinTeam(userId: number, dto: JoinTeamDto) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== UserRole.EMPLOYEE) {
      throw new BadRequestException('Only employee can join team');
    }

    const existed = await this.teamMemberRepository.exist({
      where: { user: { id: userId } },
    });

    if (existed) {
      throw new BadRequestException('User already in a team');
    }

    const team = await this.teamRepository.findOne({
      where: { invite_code: dto.invite_code },
    });

    if (!team) {
      throw new NotFoundException('Invalid invite code');
    }

    if (team.status !== 'active') {
      throw new BadRequestException('Team is not active');
    }

    const member = this.teamMemberRepository.create({
      user: { id: userId },
      team: { id: team.id },
    });
    // console.log('BODY DTO:', dto);
    // console.log('invite_code:', dto.invite_code);
    return await this.teamMemberRepository.save(member);
  }
}
