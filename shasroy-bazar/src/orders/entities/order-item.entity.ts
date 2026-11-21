<<<<<<< HEAD
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import type { Relation } from 'typeorm';
=======
import {Entity,  PrimaryGeneratedColumn, Column,ManyToOne,JoinColumn,type Relation,} from 'typeorm';

>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
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
  order!: Relation<OrderEntity>;

  @Column({ type: 'integer', nullable: true })
  listing_id!: number | null;

  @Column({ type: 'integer', nullable: true })
  bundle_id!: number | null;
<<<<<<< HEAD
}
=======
}
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
