
import {Entity, PrimaryGeneratedColumn,  Column,CreateDateColumn,UpdateDateColumn,OneToMany,Index,} from 'typeorm';

import { BundleItem } from './bundle-item.entity.js';

export enum BundleStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('product_bundle')
@Index(['merchantId'])
@Index(['bundleStatus'])
export class ProductBundle {
  @PrimaryGeneratedColumn('uuid', { name: 'bundle_id' })
  bundleId: string;

  @Column({ name: 'bundle_name', type: 'varchar', length: 150 })
  bundleName: string;

  @Column({
    name: 'bundle_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  bundlePrice: string;

  @Column({
    name: 'bundle_status',
    type: 'enum',
    enum: BundleStatus,
    default: BundleStatus.ACTIVE,
  })
  bundleStatus: BundleStatus;

  // Merchant entity is not implemented yet.
  // We will add its foreign-key relationship later.
  @Column({ name: 'merchant_id', type: 'uuid' })
  merchantId: string;

 
  @OneToMany(
  () => BundleItem,
  (item) => item.bundle,
  )
  items: BundleItem[];


  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
