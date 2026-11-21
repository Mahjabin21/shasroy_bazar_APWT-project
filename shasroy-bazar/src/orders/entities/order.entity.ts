
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, Index } from 'typeorm';
import { OrderItemEntity } from './order-item.entity.js';

@Entity({ name: 'Order' })
@Index(['user_id'])
@Index(['order_status'])
export class OrderEntity {
  @PrimaryGeneratedColumn()
  order_id: number;

  @Column({ type: 'varchar', length: 50, default: 'Pending Payment' })
  order_status: string;

  @Column({ type: 'varchar', length: 50, default: 'pickup' })
  fulfillment_type: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  pickup_code: string | null;

  @Column({ type: 'timestamp', nullable: true })
  pickup_time: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  reservation_expires_at: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  merchant_handover_at: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  no_show_at: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  delivery_address: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  recipient_phone: string | null;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  total_amount: string;

  @CreateDateColumn({ type: 'timestamp' })
  order_created_at: Date;

  @Column({ type: 'integer' })
  user_id: number;

  @Column({ type: 'integer' })
  zone_id: number;

  @OneToMany(() => OrderItemEntity, (item) => item.order, { cascade: true })
  items: OrderItemEntity[];
}
