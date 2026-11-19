import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { User } from '../../users/entities/user.entity.js';
import type { Merchant } from '../../merchants/entities/merchant.entity.js';
import type { Product } from '../../products/entities/product.entity.js';
import type { ServiceZone } from '../../service-zones/entities/service-zone.entity.js';
import type { Organization } from '../../organizations/entities/organization.entity.js';

@Entity('donation')
export class Donation {
  @PrimaryGeneratedColumn()
  donation_id: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  quantity: number;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'pending',
  })
  donation_status: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  rejection_reason: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  allocated_at: Date;

  @ManyToOne('User', { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne('Merchant', { nullable: true })
  @JoinColumn({ name: 'merchant_id' })
  merchant: Merchant;

  @ManyToOne('Product')
  @JoinColumn({ name: 'listing_id' })
  listing: Product;

  @ManyToOne('ServiceZone')
  @JoinColumn({ name: 'zone_id' })
  zone: ServiceZone;

  @ManyToOne('Organization', { nullable: true })
  @JoinColumn({ name: 'allocated_org_id' })
  allocatedOrg: Organization;
}