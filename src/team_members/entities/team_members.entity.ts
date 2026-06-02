import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
  Column,
  OneToMany,
} from 'typeorm';
import { Teams } from '../../teams/entities/teams.entity';
import { User } from '../../user/entities/user.entity';
import { WorkLog } from 'src/work-logs/entities/work-logs.entity';

@Entity('team_members')
@Unique(['user'])
export class TeamMember {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Teams, (team) => team.members, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'team_id' })
  team: Teams;

  @OneToOne(() => User, (user) => user.teamMember, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive'],
    default: 'active',
  })
  status: string;

  @OneToMany(() => WorkLog, (workLog) => workLog.teamMember)
  workLogs: WorkLog[];

  @CreateDateColumn()
  joined_at: Date;
}
