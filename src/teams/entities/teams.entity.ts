import { TeamMember } from 'src/team_members/entities/team_members.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('teams')
export class Teams {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToOne(() => User, (user) => user.ownedTeam, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ unique: true, nullable: true })
  invite_code: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'active', 'rejected'],
    default: 'pending',
  })
  status: string;

  @OneToMany(() => TeamMember, (member) => member.team)
  members: TeamMember[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
