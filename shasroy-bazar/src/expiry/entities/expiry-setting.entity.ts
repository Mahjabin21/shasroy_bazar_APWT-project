
import {
  Entity,
  PrimaryColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

@Entity('expiry_setting')
export class ExpirySetting {
  @PrimaryColumn({ name: 'setting_id', type: 'int' })
  settingId: number;

  @Column({ name: 'threshold_days', type: 'int', default: 7 })
  thresholdDays: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
