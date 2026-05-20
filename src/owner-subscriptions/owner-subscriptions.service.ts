import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  OwnerSubscription,
  SubscriptionStatus,
} from './entities/owner_subscriptions.entity';
import { Repository } from 'typeorm';
import { Teams } from '../teams/entities/teams.entity';
import { CreateOwnerSubscriptionDto } from './dto/create-owner-subscription.dto';
import { User, UserRole } from '../user/entities/user.entity';

@Injectable()
export class OwnerSubscriptionsService {
  constructor(
    @InjectRepository(OwnerSubscription)
    private readonly subscriptionRepository: Repository<OwnerSubscription>,

    @InjectRepository(Teams)
    private readonly teamRepository: Repository<Teams>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(ownerId: number, dto: CreateOwnerSubscriptionDto) {
    const team = await this.teamRepository.findOne({
      where: {
        id: dto.teamId,
        owner: { id: ownerId },
      },
    });

    if (!team) {
      throw new BadRequestException('Team not found');
    }

    const existed = await this.subscriptionRepository.findOne({
      where: {
        owner: { id: ownerId },
        month: dto.month,
      },
    });

    if (existed) {
      throw new BadRequestException(
        'Payment proof already submitted for this month',
      );
    }

    const subscription = this.subscriptionRepository.create({
      owner: { id: ownerId },
      team,
      month: dto.month,
      amount: dto.amount,
    });

    return await this.subscriptionRepository.save(subscription);
  }

  async uploadProof(ownerId: number, subscriptionId: number, proof: string) {
    const subscription = await this.subscriptionRepository.findOne({
      where: {
        id: subscriptionId,
        owner: { id: ownerId },
      },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    await this.subscriptionRepository.update(subscriptionId, {
      proof_image: proof,
      status: SubscriptionStatus.PENDING,
    });

    return {
      message: 'Upload proof successfully',
    };
  }

  async approveSubscription(id: number) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    subscription.status = SubscriptionStatus.APPROVED;

    return await this.subscriptionRepository.save(subscription);
  }

  async rejectSubscription(id: number) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    subscription.status = SubscriptionStatus.REJECTED;

    return await this.subscriptionRepository.save(subscription);
  }

  async getSubscriptionStatus(status: 'all' | 'paid' | 'unpaid') {
    const query = this.subscriptionRepository
      .createQueryBuilder('subscription')
      .innerJoin('subscription.owner', 'owner')
      .innerJoin('subscription.team', 'team')
      .select([
        'subscription.id AS id',
        'owner.username AS ownerName',
        'team.name AS teamName',
        'subscription.month AS month',
        'subscription.amount AS amount',
        'subscription.status AS status',
        'subscription.proof_image AS proofImage',
        'subscription.created_at AS createdAt',
      ]);

    if (status === 'paid') {
      query.where('subscription.status = :status', {
        status: SubscriptionStatus.APPROVED,
      });
    }

    if (status === 'unpaid') {
      query.where('subscription.status != :status', {
        status: SubscriptionStatus.APPROVED,
      });
    }

    return await query.orderBy('subscription.created_at', 'DESC').getRawMany();
  }

  async getUnpaidOwnersStats() {
    const totalOwners = await this.userRepo.count({
      where: { role: UserRole.OWNER },
    });

    const paidOwners = await this.subscriptionRepository
      .createQueryBuilder('subscription')
      .innerJoin('subscription.owner', 'owner')
      .select('COUNT(DISTINCT owner.id)', 'count')
      .where('subscription.status = :status', {
        status: 'approved',
      })
      .andWhere('MONTH(subscription.created_at) = MONTH(CURRENT_DATE())')
      .andWhere('YEAR(subscription.created_at) = YEAR(CURRENT_DATE())')
      .getRawOne();

    const paid = Number(paidOwners.count || 0);
    const unpaid = totalOwners - paid;

    return {
      unpaid,
      total: totalOwners,
      percent: totalOwners > 0 ? Math.round((unpaid / totalOwners) * 100) : 0,
    };
  }
}
