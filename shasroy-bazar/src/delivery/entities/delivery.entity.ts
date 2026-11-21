import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { OrderEntity } from '../../orders/entities/order.entity.js';

@Entity({ name: 'Delivery' })
export class DeliveryEntity {
  @PrimaryGeneratedColumn()
  delivery_id!: number;

  @Column({ type: 'integer', unique: true })
  order_id!: number;

  @OneToOne(() => OrderEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order!: OrderEntity;

  @Column({ type: 'varchar', length: 255 })
  delivery_address!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  recipient_phone!: string | null;

  @Column({ type: 'varchar', length: 50, default: 'Pending' })
  delivery_status!: string;

  @Column({ type: 'timestamp', nullable: true })
  delivered_at!: Date | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;
}
