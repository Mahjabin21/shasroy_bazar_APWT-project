import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'Purchase_Limit' })
export class PurchaseLimitEntity {
  @PrimaryGeneratedColumn()
  purchase_limit_id!: number;

  @Column({ type: 'integer', unique: true })
  listing_id!: number;

  @Column({ type: 'integer' })
  max_quantity!: number;

  @Column({ type: 'varchar', length: 50, default: 'daily' })
  period_type!: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;
}
