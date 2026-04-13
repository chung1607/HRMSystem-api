import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teams } from './entities/teams.entity';
import { User } from 'src/user/entities/user.entity';
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
    const existed = await this.teamRepo.findOne({
      where: { owner: { id: userId } },
    });

    if (existed) {
      throw new BadRequestException('User already has a team');
    }

    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    const team = this.teamRepo.create({
      ...createDto,
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
}
