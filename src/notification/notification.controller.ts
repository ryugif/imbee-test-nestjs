import { Controller, Inject } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationService } from './notification.service';

@Controller()
export class NotificationController {
  constructor(
    @Inject(NotificationService)
    private readonly notificationService: NotificationService,
  ) {}

  @EventPattern('notification.fcm.send')
  async handleMessage(
    @Payload()
    data: {
      identifier: string;
      type: string;
      message: string;
      deviceId: string;
    },
  ) {
    try {
      await this.notificationService.sentFirebaseNotification(data);
    } catch (error) {
      console.error('Error processing message:', error);
    }
  }

  @EventPattern('notification.done')
  handleDoneNotification(
    @Payload()
    data: {
      title: string;
      message?: string | null;
      deviceId: string;
    },
  ) {
    console.log(
      `Notification done received at ${new Date().toISOString()}:`,
      data,
    );
  }
}
