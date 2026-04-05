import { Teams } from 'src/teams/entities/teams.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('team_members')
@Unique(['user'])
export class Team_Members {
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
