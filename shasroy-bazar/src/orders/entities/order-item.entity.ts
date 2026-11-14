
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { OrderEntity } from './order.entity.js';

@Entity({ name: 'Order_Item' })
export class OrderItemEntity {
  @PrimaryGeneratedColumn()
  item_id!: number;

  @Column({ type: 'integer' })
  quantity!: number;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  unit_price!: string;

  @Column({ type: 'integer' })
  order_id!: number;

  @ManyToOne(() => OrderEntity, { nullable: false })
  @JoinColumn({ name: 'order_id' })
  order!: OrderEntity;

  @Column({ type: 'integer', nullable: true })
  listing_id!: number | null;

  @Column({ type: 'integer', nullable: true })
  bundle_id!: number | null;
}
