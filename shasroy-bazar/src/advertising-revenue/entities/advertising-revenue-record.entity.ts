
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

  // One successful payment reference should create
  // only one revenue record.
  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
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

  @ManyToOne('Advertisement', {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'ad_id' })
  advertisement: Advertisement;
}
