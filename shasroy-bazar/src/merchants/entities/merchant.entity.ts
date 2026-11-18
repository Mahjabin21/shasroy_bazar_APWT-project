import {Entity,PrimaryGeneratedColumn,Column,OneToOne,ManyToOne,JoinColumn} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { Administrator } from '../../administrator/entities/administrator.entity.js';
import type { Relation } from 'typeorm';

@Entity('merchants')
export class Merchant {

  @PrimaryGeneratedColumn({ 
    name: 'merchant_id' 
})
  merchantId: number;

  @Column({ 
    name: 'business_name', 
    length: 150 
})
  businessName: string;

  @Column({ 
    name: 'business_category', 
    length: 100 
})
  businessCategory: string;

  @Column({ 
    name: 'contact_person', 
    length: 100 
})
  contactPerson: string;

  @Column({ 
    name: 'contact_phone',
     length: 15 
})
  contactPhone: string;

  @Column({ 
    name: 'trade_license_ref', 
    nullable: true 
})
  tradeLicenseRef: string;

  @Column({ 
    default: 'pending' 
})
  status: string;

  @Column({ 
    name: 'review_reason', 
    type: 'text', nullable: true 
})
  reviewReason: string | null;

  @Column({ 
    name: 'reviewed_at', 
    type: 'timestamp', 
    nullable: true 
})
  reviewedAt: Date;

  @OneToOne(() => User, { 
    nullable: false 
})
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @ManyToOne(() => Administrator, { 
    nullable: true 
})
  @JoinColumn({ 
    name: 'reviewed_by_admin_id' 
})
  reviewedByAdmin: Relation<Administrator>;
}
