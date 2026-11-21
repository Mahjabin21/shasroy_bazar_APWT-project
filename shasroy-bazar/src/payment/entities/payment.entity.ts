

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  type Relation,
} from 'typeorm';

import { OrderEntity } from '../../orders/entities/order.entity.js';

@Entity({ name: 'Payment' })
@Index(['order_id'])
@Index(['payment_status'])
@Index(['idempotency_ref'], { unique: true })
@Index(['provider_txn_id'], { unique: true })
export class PaymentEntity {
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

  @Column({
    type: 'integer',
  })
  order_id!: number;

  @ManyToOne(() => OrderEntity, {
    nullable: false,
  })
  @JoinColumn({ name: 'order_id' })
  order!: Relation<OrderEntity>;
}
