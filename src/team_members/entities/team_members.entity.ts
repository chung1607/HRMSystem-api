import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { Teams } from '../../teams/entities/teams.entity';
import { User } from '../../user/entities/user.entity';

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

  @CreateDateColumn()
  joined_at: Date;
}
