import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { OrderEntity } from '../../orders/entities/order.entity.js';

@Entity({ name: 'Refund' })
export class RefundEntity {
  @PrimaryGeneratedColumn()
  refund_id!: number;

  @Column({ type: 'integer' })
  order_id!: number;

  @ManyToOne(() => OrderEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order!: OrderEntity;

  @Column({ type: 'integer' })
  user_id!: number;

  @Column({ type: 'varchar', length: 500 })
  reason!: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  refund_amount!: string;

  @Column({ type: 'varchar', length: 50, default: 'Pending' })
  refund_status!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  admin_note!: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  requested_at!: Date;

  @Column({ type: 'timestamp', nullable: true })
  processed_at!: Date | null;
}
