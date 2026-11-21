<<<<<<< HEAD
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';

import { ServiceZone } from '../../service-zones/entities/service-zone.entity.js';
import { Organization } from '../../organizations/entities/organization.entity.js';

=======
import {Entity,PrimaryGeneratedColumn,Column,OneToMany} from 'typeorm';
import { ServiceZone } from '../../service-zones/entities/service-zone.entity.js';
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
import type { Relation } from 'typeorm';

@Entity('administrator')
export class Administrator {
<<<<<<< HEAD
=======

>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
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

<<<<<<< HEAD
  @OneToMany(
    () => ServiceZone,
    (zone) => zone.createdByAdmin,
  )
  serviceZones: Relation<ServiceZone[]>;

  // Organizations verified by this administrator
  @OneToMany(
    () => Organization,
    (organization) => organization.verifiedByAdmin,
  )
  verifiedOrganizations: Relation<Organization[]>;
}
=======
  @OneToMany(() => ServiceZone, (zone) => zone.createdByAdmin)
  serviceZones: Relation<ServiceZone[]>;
}
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
