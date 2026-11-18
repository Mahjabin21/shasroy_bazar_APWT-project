

import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  
} from 'typeorm';
import type { Relation } from 'typeorm';
import { ProductBundle } from './product-bundle.entity.js';
import { Product } from '../../products/entities/product.entity.js';

@Entity('bundle_item')

export class BundleItem {
  
  @PrimaryColumn({ name: 'bundle_id', type: 'int' })
  bundleId: number;

  @PrimaryColumn({ name: 'listing_id', type: 'int' })
  listingId: number;

  @ManyToOne(
    () => ProductBundle,
    (bundle) => bundle.items,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'bundle_id',
    referencedColumnName: 'bundleId',
  })
  bundle: Relation<ProductBundle>;

  @ManyToOne(
    () => Product,
    {
      nullable: false,
      onDelete: 'RESTRICT',
    },
  )
  @JoinColumn({
    name: 'listing_id',
    referencedColumnName: 'listingId',
  })
  product:Relation<Product>;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  quantity: string;
}

