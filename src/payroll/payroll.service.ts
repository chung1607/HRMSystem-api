import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class PayrollService {
  constructor(private dataSource: DataSource) {}

  async getPayroll(ownerId: number) {
    return await this.dataSource
      .createQueryBuilder()
      .select('user.username', 'username')
      .addSelect('SUM(item.total_amount)', 'total_work_amount')
      .addSelect(
        `
      (
        SELECT COALESCE(SUM(payment.amount), 0)
        FROM payments payment
        WHERE payment.team_member_id = teamMember.id
      )
      `,
        'paid_amount',
      )
      .addSelect(
        `
      SUM(item.total_amount) -
      (
        SELECT COALESCE(SUM(payment.amount), 0)
        FROM payments payment
        WHERE payment.team_member_id = teamMember.id
      )
      `,
        'remaining_amount',
      )
      .from('work_log_items', 'item')
      .innerJoin('work_logs', 'workLog', 'workLog.id = item.workLogId')
      .innerJoin(
        'team_members',
        'teamMember',
        'teamMember.id = workLog.teamMemberId',
      )
      .innerJoin('teamMember.user', 'user')
      .innerJoin('teams', 'team', 'team.id = teamMember.team_id')
      .where('team.owner_id = :ownerId', { ownerId })
      .groupBy('teamMember.id')
      .addGroupBy('user.username')
      .getRawMany();
  }
}
