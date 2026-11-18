
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

import { OrderItemEntity } from './order-item.entity.js';


@Entity({ name: 'Order' })
export class OrderEntity {
  @PrimaryGeneratedColumn()
  order_id!: number;

  @Column({ type: 'varchar', length: 50 })
  order_status!: string;

  @Column({ type: 'varchar', length: 50 })
  fulfillment_type!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  pickup_code!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  pickup_time!: Date | null;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  total_amount!: string;

  @Column({ type: 'timestamp', nullable: true })
  reservation_expires_at!: Date | null;

  @CreateDateColumn({ type: 'timestamp' })
  order_created_at!: Date;


  @Column({ type: 'integer' })
  user_id!: number;

  @Column({ type: 'integer' })
  zone_id!: number;

  @OneToMany(() => OrderItemEntity, (item) => item.order)
  items!: OrderItemEntity[];
}


  



