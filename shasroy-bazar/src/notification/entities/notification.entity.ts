


import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

import { User } from '../../users/entities/user.entity.js';
import { Product } from '../../products/entities/product.entity.js';

@Entity('notifications')
@Index(['merchantId'])
export class Notification {
  @PrimaryGeneratedColumn({ name: 'notification_id' })
  notificationId: number;

  @Column({ type: 'varchar', length: 50 })
  type: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ name: 'is_read', default: false })
  isRead: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Customer notification
  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'userId' })
  user: User | null;

  @Column({ name: 'related_order_id', type: 'integer', nullable: true })
  relatedOrderId: number | null;

  // Merchant notification
  @Column({ name: 'merchant_id', type: 'integer', nullable: true })
  merchantId: number | null;

  @ManyToOne(() => Product, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({
    name: 'listing_id',
    referencedColumnName: 'listingId',
  })
  product: Product | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  title: string | null;
}
