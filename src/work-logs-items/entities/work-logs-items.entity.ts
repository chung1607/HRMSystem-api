import { WorkLog } from 'src/work-logs/entities/work-logs.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum CaneType {
  FRESH = 'fresh',
  BURNT = 'burnt',
}

@Entity('work_log_items')
export class WorkLogItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => WorkLog, (log) => log.items, {
    onDelete: 'CASCADE',
  })
  workLog: WorkLog;

  @Column({
    type: 'enum',
    enum: CaneType,
  })
  cane_type: CaneType;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price_per_unit: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  total_amount: number;
}
