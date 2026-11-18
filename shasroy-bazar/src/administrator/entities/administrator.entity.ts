import {Entity,PrimaryGeneratedColumn,Column,OneToMany} from 'typeorm';
import { ServiceZone } from '../../service-zones/entities/service-zone.entity.js';
import type { Relation } from 'typeorm';

@Entity('administrator')
export class Administrator {

  @PrimaryGeneratedColumn({ name: 'admin_id' })
  adminId: number;

  @Column({ name: 'full_name', length: 100 })
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ name: 'role_tier' })
  roleTier: string;

  @Column({ name: 'admin_status', default: 'active' })
  adminStatus: string;

  @OneToMany(() => ServiceZone, (zone) => zone.createdByAdmin)
  serviceZones: Relation<ServiceZone[]>;
}