import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'fcm_job' })
export class FCM_Job {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', length: 255 })
  identifier: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  deliverAt: Date;
}
