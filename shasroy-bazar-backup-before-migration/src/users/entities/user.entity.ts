import { Column, Entity, PrimaryGeneratedColumn,OneToOne} from 'typeorm';
import { EkycVerification } from '../../ekyc/entities/ekyc-verification.entity.js';
import { ManyToOne, JoinColumn } from 'typeorm';
import { ServiceZone } from '../../service-zones/entities/service-zone.entity.js';
import type { Relation } from 'typeorm';

@Entity('users')
export class User {
@PrimaryGeneratedColumn({
        name: 'user_id' 
    })
  userId: number;

  @Column({ 
    name: 'full_name' 
})
  fullName: string;

  @Column({ 
    name: 'mobile_number', 
    unique: true 
})
  mobileNumber: string;

  @Column({ 
    name: 'date_of_birth', 
    type: 'date' 
})
  dateOfBirth: Date;

  @Column({ 
    name: 'pin_hash' 
})
  pinHash: string;

  @Column({ 
    default: 'user' 
})
  role: string;

  @Column({ 
    name: 'registration_status', 
    default: 'pending' 
})
  registrationStatus: string;

  @Column({ 
    name: 'ekyc_status', 
    default: 'pending' 
})
  ekycStatus: string;

  @Column({ 
    name: 'account_status', default: 'active' 
})
  accountStatus: string;

  @Column({ 
    name: 'terms_consent', 
    default: false 
})
  termsConsent: boolean;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
  
@OneToOne(() => EkycVerification, (ekyc) => ekyc.user)
ekycVerification: Relation <EkycVerification>;


@ManyToOne(() => ServiceZone, (zone) => zone.users, {
  nullable: true,
})
@JoinColumn({ name: 'selected_zone_id' })
selectedZone: Relation<ServiceZone>;

}