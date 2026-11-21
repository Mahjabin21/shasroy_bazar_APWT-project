
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import type { Advertisement } from '../../advertisements/entities/advertisement.entity.js';

@Entity('advertising_payment')
@Index(['payment_status'])
@Index(['idempotency_ref'], { unique: true })
@Index(['provider_txn_id'], { unique: true })
export class AdvertisingPaymentEntity {
  @PrimaryGeneratedColumn()
  payment_id!: number;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
  })
  amount!: string;

  @Column({
    type: 'varchar',
    length: 30,
  })
  payment_method!: string;

  @Column({
    type: 'varchar',
    length: 30,
    default: 'Pending',
  })
  payment_status!: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
  })
  provider_txn_id!: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
  })
  idempotency_ref!: string;

  @CreateDateColumn({
    type: 'timestamp',
  })
  initiated_at!: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  confirmed_at!: Date | null;

  @ManyToOne('Advertisement', { nullable: false })
  @JoinColumn({ name: 'advertisement_id' })
  advertisement!: Advertisement;
}
