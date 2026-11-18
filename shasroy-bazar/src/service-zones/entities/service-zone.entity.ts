import {Entity,PrimaryGeneratedColumn,Column,OneToMany,ManyToOne,JoinColumn} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { Administrator } from '../../administrator/entities/administrator.entity.js';

import type { Relation } from 'typeorm';

@Entity('service_zone')
export class ServiceZone {

  @PrimaryGeneratedColumn({
    name: 'zone_id',
  })
  zoneId: number;

  @Column({
    name: 'zone_name',
    length: 100,
  })
  zoneName: string;

  @Column({
    name: 'boundary_definition',
    type: 'text',
  })
  boundaryDefinition: string;

  @Column({
    name: 'zone_status',
    default: 'active',
  })
  zoneStatus: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  // One administrator can create multiple service zones
  @ManyToOne(
    () => Administrator,
    (administrator) => administrator.serviceZones,
    { nullable: false },
  )
  @JoinColumn({ name: 'created_by_admin_id' })
  createdByAdmin: Relation<Administrator>;

  // One service zone can be selected by multiple users
  @OneToMany(
    () => User,
    (user) => user.selectedZone,
  )
  users: Relation<User[]>;
}