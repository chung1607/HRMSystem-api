import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

import { User } from '../../user/entities/user.entity';

export enum OwnerRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('owner_requests')
export class OwnerRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: OwnerRequestStatus,
    default: OwnerRequestStatus.PENDING,
  })
  status: OwnerRequestStatus;

  @ManyToOne(() => User, (user) => user.ownerRequests, {
    onDelete: 'CASCADE',
  })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
