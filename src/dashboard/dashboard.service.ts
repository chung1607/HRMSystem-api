import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(private dataSource: DataSource) {}

  async getWorkAmountChart(ownerId: number) {
    return await this.dataSource
      .createQueryBuilder()
      .select('workLog.work_date', 'date')
      .addSelect('SUM(item.total_amount)', 'total_amount')
      .from('work_log_items', 'item')
      .innerJoin('work_logs', 'workLog', 'workLog.id = item.workLogId')
      .innerJoin(
        'team_members',
        'teamMember',
        'teamMember.id = workLog.teamMemberId',
      )
      .innerJoin('teams', 'team', 'team.id = teamMember.team_id')
      .where('team.owner_id = :ownerId', {
        ownerId,
      })
      .groupBy('workLog.work_date')
      .orderBy('workLog.work_date', 'ASC')
      .getRawMany();
  }

  async getTeamPerformance(ownerId: number) {
    return await this.dataSource
      .createQueryBuilder()
      .select('user.username', 'username')
      .addSelect('SUM(item.quantity)', 'total_quantity')
      .addSelect('SUM(item.total_amount)', 'total_amount')
      .from('work_log_items', 'item')
      .innerJoin('work_logs', 'workLog', 'workLog.id = item.workLogId')
      .innerJoin(
        'team_members',
        'teamMember',
        'teamMember.id = workLog.teamMemberId',
      )
      .innerJoin('users', 'user', 'user.id = teamMember.user_id')
      .innerJoin('teams', 'team', 'team.id = teamMember.team_id')
      .where('team.owner_id = :ownerId', {
        ownerId,
      })
      .groupBy('user.username')
      .orderBy('SUM(item.total_amount)', 'DESC')
      .getRawMany();
  }

  async getTotalCaneByDate(ownerId: number) {
    return await this.dataSource
      .createQueryBuilder()
      .select('workLog.work_date', 'date')
      .addSelect('SUM(item.quantity)', 'total_quantity')
      .from('work_log_items', 'item')
      .innerJoin('work_logs', 'workLog', 'workLog.id = item.workLogId')
      .innerJoin(
        'team_members',
        'teamMember',
        'teamMember.id = workLog.teamMemberId',
      )
      .innerJoin('teams', 'team', 'team.id = teamMember.team_id')
      .where('team.owner_id = :ownerId', {
        ownerId,
      })
      .groupBy('workLog.work_date')
      .orderBy('workLog.work_date', 'ASC')
      .getRawMany();
  }
}
