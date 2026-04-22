import { Injectable } from '@nestjs/common';
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
        const [totalUsers, totalOwners, totalTeams, totalWorkers] = await Promise.all([
            this.userRepository.count(),
            this.userRepository.count({ where: { role: UserRole.OWNER } }),
            this.teamsRepository.count(),
            this.userRepository.count({ where: { role: UserRole.EMPLOYEE } }),
        ])
        return { totalUsers, totalOwners, totalTeams, totalWorkers };
    }
}
