import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWorkLogDto } from './dto/create-work-log.dto';
import { TeamMember } from '../team_members/entities/team_members.entity';
import { WorkLog } from './entities/work-logs.entity';
import {
  WorkLogItem,
  CaneType,
} from '../work-logs-items/entities/work-logs-items.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class WorkLogsService {
  constructor(private dataSource: DataSource) {}
  async createWorkLog(ownerId: number, dto: CreateWorkLogDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const member = await queryRunner.manager.findOne(TeamMember, {
        where: { id: dto.team_member_id },
        relations: ['team', 'team.owner'],
      });
      if (!member) {
        throw new NotFoundException('Team member not found');
      }
      if (member.team.owner.id !== ownerId) {
        throw new BadRequestException('Not your team member');
      }
      const existed = await queryRunner.manager.findOne(WorkLog, {
        where: {
          teamMember: { id: dto.team_member_id },
          work_date: dto.work_date,
        },
      });

      if (existed) {
        throw new BadRequestException('Work log already exists for this date');
      }

      const workLog = queryRunner.manager.create(WorkLog, {
        teamMember: member,
        work_date: dto.work_date,
      });

      const savedLog = await queryRunner.manager.save(workLog);

      const items = dto.items.map((item) =>
        queryRunner.manager.create(WorkLogItem, {
          workLog: savedLog,
          cane_type: item.cane_type as CaneType,
          quantity: item.quantity,
          price_per_unit: item.price_per_unit,
          total_amount: item.quantity * item.price_per_unit,
        }),
      );
      await queryRunner.manager.save(WorkLogItem, items);

      await queryRunner.commitTransaction();
      return {
        message: 'Work log created successfully',
        work_log_id: savedLog.id,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // Get summary of work logs for all team members under the owner
  async getMembersSummary(ownerId: number) {
    const results = await this.dataSource
      .getRepository(WorkLogItem)
      .createQueryBuilder('item')
      .innerJoin('item.workLog', 'workLog')
      .innerJoin('workLog.teamMember', 'teamMember')
      .innerJoin('teamMember.user', 'user')
      .innerJoin('teamMember.team', 'team')
      .innerJoin('team.owner', 'owner')
      .select('teamMember.id', 'team_member_id')
      .addSelect('user.username', 'username')
      .addSelect('COUNT(DISTINCT workLog.id)', 'total_days')
      .addSelect('SUM(item.quantity)', 'total_quantity')
      .addSelect('SUM(item.total_amount)', 'total_amount')
      .where('owner.id = :ownerId', { ownerId })
      .groupBy('teamMember.id')
      .addGroupBy('user.username')
      .getRawMany();
    return results;
  }

  // Get summary of work logs for a specific team member
  async getMemberSummary(ownerId: number, teamMemberId: number) {
    const member = await this.dataSource
      .getRepository(TeamMember)
      .createQueryBuilder('teamMember')
      .innerJoinAndSelect('teamMember.user', 'user')
      .innerJoinAndSelect('teamMember.team', 'team')
      .innerJoinAndSelect('team.owner', 'owner')
      .where('teamMember.id = :teamMemberId', {
        teamMemberId,
      })
      .andWhere('owner.id = :ownerId', {
        ownerId,
      })
      .getOne();

    if (!member) {
      throw new NotFoundException('Team member not found');
    }

    const logs = await this.dataSource
      .getRepository(WorkLogItem)
      .createQueryBuilder('item')
      .innerJoin('item.workLog', 'workLog')
      .innerJoin('workLog.teamMember', 'teamMember')
      .select('workLog.work_date', 'work_date')
      .addSelect('SUM(item.total_amount)', 'total_amount')
      .where('teamMember.id = :teamMemberId', {
        teamMemberId,
      })
      .groupBy('workLog.work_date')
      .orderBy('workLog.work_date', 'ASC')
      .getRawMany();

    const grandTotal = logs.reduce(
      (sum, item) => sum + Number(item.total_amount),
      0,
    );

    return {
      username: member.user.username,
      work_logs: logs,
      grand_total: grandTotal,
    };
  }
}
