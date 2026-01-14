import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FCM_Job } from '../databases/fcm_job.entity';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService],
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  imports: [TypeOrmModule.forFeature([FCM_Job])],
})
export class NotificationModule {}
