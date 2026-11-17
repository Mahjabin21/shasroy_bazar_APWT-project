
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum ProductListingStatus {
  ACTIVE = 'ACTIVE',
  REMOVED = 'REMOVED',
}

@Entity('product_listing')
@Index(['merchantId'])
@Index(['listingStatus'])
@Index(['expiryDate'])
export class Product {
  @PrimaryGeneratedColumn('uuid', { name: 'listing_id' })
  listingId: string;

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

  @Column({ name: 'merchant_id', type: 'uuid' })
  merchantId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
