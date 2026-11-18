import {Column,Entity,PrimaryGeneratedColumn,OneToOne,JoinColumn} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import type { Relation } from 'typeorm';
@Entity('EKYC_Verification')
export class EkycVerification {

  @PrimaryGeneratedColumn({
    name: 'ekyc_id',
  })
  ekycId: number;

 @Column({
  name: 'nid_number',
  unique: true,
  length: 20,
 })
nidNumber: string;

  @Column({
    name: 'nid_front_url',
    type: 'text',
    nullable: true,
  })
  nidFrontUrl: string | null;

  @Column({
    name: 'nid_back_url',
    type: 'text',
    nullable: true,
  })
  nidBackUrl: string | null;

  @Column({
    name: 'selfie_url',
    type: 'text',
    nullable: true,
  })
  selfieUrl: string | null;

  @Column({
    name: 'provider_reference',
    type: 'varchar',
    nullable: true,
  })
  providerReference: string | null;

  @Column({
    name: 'consent_timestamp',
    type: 'timestamp',
  })
  consentTimestamp: Date;

  @Column({
    name: 'verification_status',
    type: 'varchar',
    length: 40,
    default: 'pending',
  })
  verificationStatus: string;

  @Column({
    name: 'decision_timestamp',
    type: 'timestamp',
    nullable: true,
  })
  decisionTimestamp: Date | null;

@OneToOne(() => User, (user) => user.ekycVerification)
@JoinColumn({ name: 'user_id', referencedColumnName: 'userId' })
user: Relation<User>;
}