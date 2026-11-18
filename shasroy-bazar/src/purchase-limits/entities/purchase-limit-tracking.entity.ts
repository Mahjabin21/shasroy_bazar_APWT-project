
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity({ name: 'Purchase_Limit_Tracking' })
export class PurchaseLimitTrackingEntity {
  @PrimaryGeneratedColumn()
  limit_id!: number;

  @Column({ type: 'varchar', length: 50 })
  period_type!: string;

  @Column({ type: 'integer' })
  purchase_count!: number;

  @Column({ type: 'timestamp' })
  period_start!: Date;

  @Column({ type: 'timestamp' })
  period_end!: Date;

  @Column({ type: 'integer' })
  user_id!: number;

  @Column({ type: 'integer' })
  listing_id!: number;
}
