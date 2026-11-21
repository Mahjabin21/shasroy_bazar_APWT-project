<<<<<<< HEAD

=======
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
<<<<<<< HEAD

import type { Organization } from '../../organizations/entities/organization.entity.js';
import type { Administrator } from '../../administrator/entities/administrator.entity.js';

export enum AdvertisementStatus {
  PENDING_PAYMENT = 'pending_payment',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended',
  REMOVED = 'removed',
  EXPIRED = 'expired',
}

=======
import type { Organization } from '../../organizations/entities/organization.entity.js';
import type { Administrator } from '../../administrator/entities/administrator.entity.js';

>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
@Entity('advertisement')
export class Advertisement {
  @PrimaryGeneratedColumn()
  ad_id: number;

  @Column({
    type: 'varchar',
    length: 100,
  })
  campaign_name: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  content_url: string;

  @Column({
    type: 'date',
  })
  start_date: Date;

  @Column({
    type: 'date',
  })
  end_date: Date;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  budget: number;

  @Column({
    type: 'varchar',
    length: 20,
<<<<<<< HEAD
    default: AdvertisementStatus.PENDING,
  })
  ad_status: AdvertisementStatus;

  @Column({
    type: 'text',
    nullable: true,
  })
  review_reason: string | null;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  reviewed_at: Date | null;
=======
    default: 'pending',
  })
  ad_status: string;
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361

  @ManyToOne('Organization')
  @JoinColumn({ name: 'org_id' })
  organization: Organization;

  @ManyToOne('Administrator', { nullable: true })
<<<<<<< HEAD
  @JoinColumn({ name: 'reviewed_by_admin_id' })
  reviewedByAdmin: Administrator | null;
}
=======
  @JoinColumn({ name: 'approved_by_admin_id' })
  approvedByAdmin: Administrator;
}
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
