import { Entity,PrimaryGeneratedColumn,Column,CreateDateColumn,UpdateDateColumn,Index,ManyToOne,JoinColumn, ManyToMany, JoinTable,} from 'typeorm';
import type { Relation } from 'typeorm';

import { Merchant } from '../../merchants/entities/merchant.entity.js';
import { ServiceZone } from '../../service-zones/entities/service-zone.entity.js';

export enum ProductListingStatus {
  ACTIVE = 'ACTIVE',
  REMOVED = 'REMOVED',
}

@Entity('product_listing')
@Index(['merchantId'])
@Index(['listingStatus'])
@Index(['expiryDate'])


export class Product {
  @PrimaryGeneratedColumn({ name: 'listing_id' })
  listingId: number;

  @Column({ name: 'product_name', type: 'varchar', length: 150 })
  productName: string;

  @Column({ type: 'varchar', length: 100 })
  category: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({
    name: 'quantity_available',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  quantityAvailable: number;

  @Column({ type: 'varchar', length: 30 })
  unit: string;

  @Column({ name: 'product_photo_url', type: 'text', nullable: true })
  productPhotoUrl: string | null;

  @Column({ name: 'expiry_date', type: 'date' })
  expiryDate: string;

  @Column({ name: 'expiry_photo_url', type: 'text' })
  expiryPhotoUrl: string;

  @Column({
    name: 'merchant_original_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  merchantOriginalPrice: string | number | null;

  @Column({
    name: 'system_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  systemPrice: string | number | null;

  @Column({
    name: 'listing_status',
    type: 'enum',
    enum: ProductListingStatus,
    default: ProductListingStatus.ACTIVE,
  })
  listingStatus: ProductListingStatus;

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

  @ManyToMany(() => ServiceZone)
  @JoinTable({
    name: 'listing_zone',
    joinColumn: {
      name: 'listing_id',
      referencedColumnName: 'listingId',
    },
    inverseJoinColumn: {
      name: 'zone_id',
      referencedColumnName: 'zoneId',
    },
  })
  zones: Relation<ServiceZone[]>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
