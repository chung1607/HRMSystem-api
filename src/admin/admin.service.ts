import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Teams } from 'src/teams/entities/teams.entity';
import { User, UserRole } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Teams)
    private readonly teamsRepository: Repository<Teams>,
  ) {}

  async getDashboardStats() {
    const [totalUsers, totalOwners, totalTeams, totalEmployees] =
      await Promise.all([
        this.userRepository.count(),
        this.userRepository.count({ where: { role: UserRole.OWNER } }),
        this.teamsRepository.count(),
        this.userRepository.count({ where: { role: UserRole.EMPLOYEE } }),
      ]);
    return { totalUsers, totalOwners, totalTeams, totalEmployees };
  }

  async disableUser(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.is_active = false;
    await this.userRepository.save(user);
    return { message: 'User disabled successfully' };
  }

  async enableUser(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.is_active = true;
    await this.userRepository.save(user);
    return { message: 'User enabled successfully' };
  }

  async updateUserRole(userId: number, role: UserRole) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.role = role;
    await this.userRepository.save(user);

    return { message: 'Role updated successfully' };
  }
}
