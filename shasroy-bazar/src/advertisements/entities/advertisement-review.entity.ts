
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import type { Advertisement } from './advertisement.entity.js';
import type { Administrator } from '../../administrator/entities/administrator.entity.js';

@Entity('advertisement_review')
export class AdvertisementReview {
  @PrimaryGeneratedColumn()
  review_id: number;

  @ManyToOne('Advertisement', { nullable: false })
  @JoinColumn({ name: 'ad_id' })
  advertisement: Advertisement;

  @ManyToOne('Administrator', { nullable: false })
  @JoinColumn({ name: 'admin_id' })
  reviewedByAdmin: Administrator;

  @Column({
    type: 'varchar',
    length: 20,
  })
  previous_status: string;

  @Column({
    type: 'varchar',
    length: 20,
  })
  new_status: string;

  @Column({
    type: 'text',
  })
  reason: string;

  @CreateDateColumn()
  reviewed_at: Date;
}
