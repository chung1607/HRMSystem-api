import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payments.entity';
import { TeamMember } from 'src/team_members/entities/team_members.entity';
import { WorkLogItem } from 'src/work-logs-items/entities/work-logs-items.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(TeamMember)
    private readonly teamMemberRepository: Repository<TeamMember>,

    @InjectRepository(WorkLogItem)
    private readonly workLogItemRepository: Repository<WorkLogItem>,
  ) {}

  async createPayment(ownerId: number, dto: CreatePaymentDto) {
    const member = await this.teamMemberRepository.findOne({
      where: {
        id: dto.team_member_id,
        team: {
          owner: {
            id: ownerId,
          },
        },
      },
      relations: ['team', 'team.owner'],
    });

    if (!member) {
      throw new NotFoundException('Team member not found');
    }

    const payment = this.paymentRepository.create({
      teamMember: member,
      amount: dto.amount,
      payment_date: dto.payment_date,
      note: dto.note,
    });

    return await this.paymentRepository.save(payment);
  }

  async getPaymentHistory(ownerId: number, teamMemberId: number) {
    const member = await this.teamMemberRepository.findOne({
      where: {
        id: teamMemberId,
        team: {
          owner: {
            id: ownerId,
          },
        },
      },
      relations: ['user', 'team', 'team.owner'],
    });

    if (!member) {
      throw new NotFoundException('Team member not found');
    }

    const totalWork = await this.workLogItemRepository
      .createQueryBuilder('item')
      .innerJoin('item.workLog', 'workLog')
      .innerJoin('workLog.teamMember', 'teamMember')
      .select('SUM(item.total_amount)', 'total')
      .where('teamMember.id = :teamMemberId', { teamMemberId })
      .getRawOne();

    const payments = await this.paymentRepository.find({
      where: {
        teamMember: {
          id: teamMemberId,
        },
      },
      order: {
        payment_date: 'DESC',
      },
    });

    const totalPaid = payments.reduce(
      (sum, payment) => sum + Number(payment.amount),
      0,
    );

    const totalWorkAmount = Number(totalWork.total || 0);

    return {
      username: member.user.username,
      total_work_amount: totalWorkAmount,
      paid_amount: totalPaid,
      remaining_amount: totalWorkAmount - totalPaid,
      payment_history: payments,
    };
  }
}
