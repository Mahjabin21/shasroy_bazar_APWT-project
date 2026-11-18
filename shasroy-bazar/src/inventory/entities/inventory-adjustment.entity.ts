import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('inventory_adjustments')
@Index(['listingId', 'createdAt'])
export class InventoryAdjustment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'listing_id', type: 'int' })
  listingId: number;

  @Column({ name: 'merchant_id', type: 'int' })
  merchantId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantityChange: string;

  @Column({ type: 'varchar', length: 30 })
  reason: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  note: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}