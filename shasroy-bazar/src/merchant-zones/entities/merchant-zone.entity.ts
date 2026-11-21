import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Merchant } from '../../merchants/entities/merchant.entity.js';
import { ServiceZone } from '../../service-zones/entities/service-zone.entity.js';

import type { Relation } from 'typeorm';

@Entity('merchant_zone')
export class MerchantZone {

  @PrimaryColumn({ name: 'merchant_id', type: 'int' })
  merchantId: number;

  @PrimaryColumn({ name: 'zone_id', type: 'int' })
  zoneId: number;

  @ManyToOne(
    () => Merchant,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({
    name: 'merchant_id',
    referencedColumnName: 'merchantId',
  })
  merchant: Relation<Merchant>;

  @ManyToOne(
    () => ServiceZone,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({
    name: 'zone_id',
    referencedColumnName: 'zoneId',
  })
  zone: Relation<ServiceZone>;
}
