import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
  verified_at: Date;
}
