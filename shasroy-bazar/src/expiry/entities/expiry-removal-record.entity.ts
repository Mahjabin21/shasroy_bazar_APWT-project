
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Product } from '../../products/entities/product.entity.js';

@Entity('expiry_removal_record')
export class ExpiryRemovalRecord {
  @PrimaryGeneratedColumn('uuid', { name: 'removal_id' })
  removalId: string;

  @OneToOne(() => Product, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'listing_id',
    referencedColumnName: 'listingId',
  })
  product: Product;

  @Column({ name: 'recorded_expiry_date', type: 'date' })
  recordedExpiryDate: string;

  @Column({ name: 'threshold_days', type: 'int' })
  thresholdDays: number;

  @CreateDateColumn({ name: 'removal_timestamp' })
  removalTimestamp: Date;
}
