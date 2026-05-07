import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teams } from './entities/teams.entity';
import { User, UserRole } from 'src/user/entities/user.entity';
import { UpdateTeamDto } from './dto/update-team.dto';
import { CreateTeamDto } from './dto/create-team.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Teams)
    private readonly teamRepo: Repository<Teams>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(createDto: CreateTeamDto, userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== UserRole.OWNER) {
      throw new BadRequestException('Only owner can create team');
    }

    const existed = await this.teamRepo.exist({
      where: { owner: { id: userId } },
    });

    if (existed) {
      throw new BadRequestException('Owner already has a team');
    }

    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const team = this.teamRepo.create({
      ...createDto,
      invite_code: inviteCode,
      owner: user,
    });
    return await this.teamRepo.save(team);
  }

  async findAll() {
    return await this.teamRepo.find({
      relations: ['owner'],
    });
  }

  async findOne(id: number) {
    const team = await this.teamRepo.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!team) throw new NotFoundException('Team not found');
    return team;
  }

  async update(id: number, updateDto: UpdateTeamDto) {
    const team = await this.findOne(id);

    Object.assign(team, updateDto);

    return await this.teamRepo.save(team);
  }

  async remove(id: number) {
    const team = await this.findOne(id);

    return await this.teamRepo.remove(team);
  }

  async getMyTeam(ownerId: number) {
    const team = await this.teamRepo.findOne({
      where: { owner: { id: ownerId } },
      relations: ['members', 'members.user'],
    });
    if (!team) {
      throw new NotFoundException('Team not found');
    }
    return {
      id: team.id,
      name: team.name,
      invite_code: team.invite_code,
      status: team.status,
      members: team.members.map((member) => ({
        team_member_id: member.id,
        user_id: member.user.id,
        username: member.user.username,
        phone: member.user.phone,
        joined_at: member.joined_at,
      })),
    };
  }
}
