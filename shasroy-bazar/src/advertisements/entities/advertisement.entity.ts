import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Organization } from '../../organizations/entities/organization.entity.js';
import type { Administrator } from '../../administrator/entities/administrator.entity.js';

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
    default: 'pending',
  })
  ad_status: string;

  @ManyToOne('Organization')
  @JoinColumn({ name: 'org_id' })
  organization: Organization;

  @ManyToOne('Administrator', { nullable: true })
  @JoinColumn({ name: 'approved_by_admin_id' })
  approvedByAdmin: Administrator;
}