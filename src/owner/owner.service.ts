import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  OwnerSubscription,
  SubscriptionStatus,
} from '../owner-subscriptions/entities/owner_subscriptions.entity';
import { TeamMember } from '../team_members/entities/team_members.entity';
import { Teams } from '../teams/entities/teams.entity';
import { WorkLogItem } from '../work-logs-items/entities/work-logs-items.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OwnerService {
  constructor(
    @InjectRepository(Teams)
    private readonly teamRepository: Repository<Teams>,

    @InjectRepository(TeamMember)
    private readonly memberRepository: Repository<TeamMember>,

    @InjectRepository(WorkLogItem)
    private readonly workLogItemRepository: Repository<WorkLogItem>,

    @InjectRepository(OwnerSubscription)
    private readonly subscriptionRepository: Repository<OwnerSubscription>,
  ) {}

  async getDashboardStats(ownerId: number) {
    const team = await this.teamRepository.findOne({
      where: {
        owner: {
          id: ownerId,
        },
      },
    });

    if (!team) {
      return {
        totalMembers: 0,
        totalCanes: 0,
        totalPayments: 0,
        subscriptionStatus: 'unpaid',
      };
    }

    const totalMembers = await this.memberRepository.count({
      where: {
        team: {
          id: team.id,
        },
      },
    });

    const caneResult = await this.workLogItemRepository
      .createQueryBuilder('item')
      .innerJoin('item.workLog', 'log')
      .innerJoin('log.teamMember', 'member')
      .innerJoin('member.team', 'team')
      .select('SUM(item.quantity)', 'totalCanes')
      .where('team.id = :teamId', {
        teamId: team.id,
      })
      .getRawOne();

    const paymentResult = await this.workLogItemRepository
      .createQueryBuilder('item')
      .innerJoin('item.workLog', 'log')
      .innerJoin('log.teamMember', 'member')
      .innerJoin('member.team', 'team')
      .select('SUM(item.total_amount)', 'totalPayments')
      .where('team.id = :teamId', {
        teamId: team.id,
      })
      .getRawOne();

    const subscription = await this.subscriptionRepository.findOne({
      where: {
        owner: {
          id: ownerId,
        },
      },
      order: {
        created_at: 'DESC',
      },
    });

    return {
      totalMembers,
      totalCanes: Number(caneResult.totalCanes || 0),
      totalPayments: Number(paymentResult.totalPayments || 0),
      subscriptionStatus: subscription?.status || SubscriptionStatus.PENDING,
    };
  }

  async getCaneChart(ownerId: number, range: 'week' | 'month' | 'year') {
    const team = await this.teamRepository.findOne({
      where: {
        owner: {
          id: ownerId,
        },
      },
    });

    if (!team) {
      return [];
    }

    let interval = '7 DAY';

    if (range === 'month') interval = '30 DAY';
    if (range === 'year') interval = '12 MONTH';

    return await this.workLogItemRepository
      .createQueryBuilder('item')
      .innerJoin('item.workLog', 'log')
      .innerJoin('log.teamMember', 'member')
      .innerJoin('member.user', 'user')
      .innerJoin('member.team', 'team')
      .select('user.username', 'label')
      .addSelect('SUM(item.quantity)', 'total')
      .where('team.id = :teamId', {
        teamId: team.id,
      })
      .andWhere(`log.work_date >= DATE_SUB(CURDATE(), INTERVAL ${interval})`)
      .groupBy('member.id')
      .orderBy('total', 'DESC')
      .getRawMany();
  }

  async getCaneTypeChart(ownerId: number) {
    const team = await this.teamRepository.findOne({
      where: {
        owner: {
          id: ownerId,
        },
      },
    });

    if (!team) {
      return [];
    }

    return await this.workLogItemRepository
      .createQueryBuilder('item')
      .innerJoin('item.workLog', 'log')
      .innerJoin('log.teamMember', 'member')
      .innerJoin('member.team', 'team')
      .select('item.cane_type', 'name')
      .addSelect('SUM(item.quantity)', 'value')
      .where('team.id = :teamId', {
        teamId: team.id,
      })
      .groupBy('item.cane_type')
      .getRawMany();
  }

  async getTopWorkers(ownerId: number) {
    const team = await this.teamRepository.findOne({
      where: {
        owner: {
          id: ownerId,
        },
      },
    });

    if (!team) {
      return [];
    }

    return await this.workLogItemRepository
      .createQueryBuilder('item')
      .innerJoin('item.workLog', 'log')
      .innerJoin('log.teamMember', 'member')
      .innerJoin('member.user', 'user')
      .innerJoin('member.team', 'team')
      .select('user.username', 'name')
      .addSelect('SUM(item.total_amount)', 'total')
      .where('team.id = :teamId', {
        teamId: team.id,
      })
      .groupBy('member.id')
      .orderBy('total', 'DESC')
      .limit(5)
      .getRawMany();
  }

  async getRecentWorkLogs(ownerId: number) {
    const team = await this.teamRepository.findOne({
      where: {
        owner: {
          id: ownerId,
        },
      },
    });

    if (!team) {
      return [];
    }

    return await this.workLogItemRepository
      .createQueryBuilder('item')
      .innerJoin('item.workLog', 'log')
      .innerJoin('log.teamMember', 'member')
      .innerJoin('member.user', 'user')
      .innerJoin('member.team', 'team')
      .select('user.username', 'worker')
      .addSelect('log.work_date', 'date')
      .addSelect('item.cane_type', 'caneType')
      .addSelect('item.quantity', 'quantity')
      .addSelect('item.total_amount', 'total')
      .where('team.id = :teamId', {
        teamId: team.id,
      })
      .orderBy('log.work_date', 'DESC')
      .limit(10)
      .getRawMany();
  }
}
