import { TeamMember } from "src/team_members/entities/team_members.entity";
import { WorkLogItem } from "src/work-logs-items/entities/work-logs-items.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('work_logs')
export class WorkLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TeamMember, { onDelete: 'CASCADE' })
  teamMember: TeamMember;

  @Column({ type: 'date' })
  work_date: Date;

  @OneToMany(() => WorkLogItem, (item) => item.workLog)
  items: WorkLogItem[];

  @CreateDateColumn()
  created_at: Date;
}