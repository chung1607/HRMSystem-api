import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  OwnerSubscription,
  SubscriptionStatus,
} from 'src/owner-subscriptions/entities/owner_subscriptions.entity';
import { Payment } from 'src/payments/entities/payments.entity';
import { Teams } from 'src/teams/entities/teams.entity';
import { User, UserRole } from 'src/user/entities/user.entity';
import { WorkLogItem } from 'src/work-logs-items/entities/work-logs-items.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Teams)
    private readonly teamsRepository: Repository<Teams>,

    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(WorkLogItem)
    private readonly workLogItemRepository: Repository<WorkLogItem>,

    @InjectRepository(OwnerSubscription)
    private readonly ownerSubscriptionRepository: Repository<OwnerSubscription>,
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

  async getAdminPaymentChart(range: 'week' | 'month' | 'year') {
    let interval = '7 DAY';

    if (range === 'month') interval = '30 DAY';
    if (range === 'year') interval = '12 MONTH';

    return await this.paymentRepository
      .createQueryBuilder('payment')
      .innerJoin('payment.teamMember', 'teamMember')
      .innerJoin('teamMember.team', 'team')
      .select('team.name', 'label')
      .addSelect('SUM(payment.amount)', 'total')
      .where(
        `payment.payment_date >= DATE_SUB(CURDATE(), INTERVAL ${interval})`,
      )
      .groupBy('team.id')
      .orderBy('total', 'DESC')
      .getRawMany();
  }

  async getSugarcaneByTeam() {
    return await this.workLogItemRepository
      .createQueryBuilder('item')
      .innerJoin('item.workLog', 'workLog')
      .innerJoin('workLog.teamMember', 'teamMember')
      .innerJoin('teamMember.team', 'team')
      .select('team.name', 'name')
      .addSelect(
        `
      SUM(CASE WHEN item.cane_type = 'fresh' THEN item.quantity ELSE 0 END)
    `,
        'fresh',
      )
      .addSelect(
        `
      SUM(CASE WHEN item.cane_type = 'burnt' THEN item.quantity ELSE 0 END)
    `,
        'burnt',
      )
      .groupBy('team.id')
      .orderBy('fresh', 'DESC')
      .getRawMany();
  }

  async getSubscriptionStatusStats() {
    const total = await this.ownerSubscriptionRepository.count();

    const approved = await this.ownerSubscriptionRepository.count({
      where: { status: SubscriptionStatus.APPROVED },
    });

    const pending = await this.ownerSubscriptionRepository.count({
      where: { status: SubscriptionStatus.PENDING },
    });

    const rejected = await this.ownerSubscriptionRepository.count({
      where: { status: SubscriptionStatus.REJECTED },
    });

    return {
      approved,
      pending,
      rejected,
      total,
    };
  }

  async getTeamPerformanceComparison() {
    const memberTotals = await this.workLogItemRepository
      .createQueryBuilder('item')
      .innerJoin('item.workLog', 'log')
      .innerJoin('log.teamMember', 'member')
      .innerJoin('member.user', 'user')
      .innerJoin('member.team', 'team')
      .select('team.name', 'teamName')
      .addSelect('user.username', 'memberName')
      .addSelect('SUM(item.total_amount)', 'total')
      .groupBy('team.id')
      .addGroupBy('team.name')
      .addGroupBy('member.id')
      .addGroupBy('user.username')
      .orderBy('team.id', 'ASC')
      .addOrderBy('total', 'DESC')
      .getRawMany();

    const topMembers = {};

    memberTotals.forEach((item) => {
      if (!topMembers[item.teamName]) {
        topMembers[item.teamName] = {
          name: item.teamName,
          member: item.memberName,
          total: Number(item.total),
        };
      }
    });

    return Object.values(topMembers);
  }
}
