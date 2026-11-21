
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity.js';
import { Administrator } from '../../administrator/entities/administrator.entity.js';
import type { Relation } from 'typeorm';

@Entity('organization')
export class Organization {
  @PrimaryGeneratedColumn()
  org_id: number;

  @Column({
    type: 'varchar',
    length: 100,
  })
  org_name: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  contact_person: string;

  @Column({
    type: 'varchar',
    length: 20,
  })
  contact_phone: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'pending',
  })
  organization_status: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  verified_at: Date | null;

  @OneToOne(() => User, {
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @ManyToOne(() => Administrator, {
    nullable: true,
  })
  @JoinColumn({ name: 'verified_by_admin_id' })
  verifiedByAdmin: Relation<Administrator> | null;
}
