

import {Entity, PrimaryGeneratedColumn,  Column,CreateDateColumn,UpdateDateColumn,OneToMany,ManyToOne,JoinColumn,Index,} from 'typeorm';
import type { Relation } from 'typeorm';

import { Merchant } from '../../merchants/entities/merchant.entity.js';

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

  @Column({ name: 'merchant_id', type: 'int' })
  merchantId: number;

  @ManyToOne(() => Merchant, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'merchant_id',
    referencedColumnName: 'merchantId',
  })
  merchant: Relation<Merchant>;

 
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
