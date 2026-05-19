import { User } from '../../user/entities/user.entity';
import { Teams } from '../../teams/entities/teams.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum SubscriptionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('owner_subscriptions')
export class OwnerSubscription {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  owner: User;

  @ManyToOne(() => Teams)
  team: Teams;

  @Column()
  month: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  amount: number;

  @Column({ nullable: true })
  proof_image: string;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.PENDING,
  })
  status: SubscriptionStatus;

  @Column({ nullable: true })
  admin_note: string;

  @CreateDateColumn()
  created_at: Date;
}
