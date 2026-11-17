import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Advertisement } from '../../advertisements/entities/advertisement.entity.js';

@Entity('advertising_revenue_record')
export class AdvertisingRevenueRecord {
  @PrimaryGeneratedColumn()
  revenue_id: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  amount: number;

  @Column({
    type: 'varchar',
    length: 100,
  })
  payment_ref: string;

  @Column({
    type: 'date',
  })
  period_start: Date;

  @Column({
    type: 'date',
  })
  period_end: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  recorded_at: Date;

  @ManyToOne('Advertisement')
  @JoinColumn({ name: 'ad_id' })
  advertisement: Advertisement;
}