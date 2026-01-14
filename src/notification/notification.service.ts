import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Payload,
} from '@nestjs/microservices';
import { rabbitMQConfig } from '../configs/rabbitmq.config';
import admin from 'firebase-admin';
import serviceAccount from '../../serviceAccountKey.json';
import { FCM_Job } from '../databases/fcm_job.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

@Injectable()
export class NotificationService {
  private client: ClientProxy;

  constructor(
    @InjectRepository(FCM_Job)
    private repository: Repository<FCM_Job>,
  ) {
    this.client = ClientProxyFactory.create(rabbitMQConfig());
  }

  async sentFirebaseNotification(
    @Payload()
    data: {
      identifier: string;
      type: string;
      message: string;
      deviceId: string;
    },
    // @Ctx() context: RmqContext,
  ) {
    if (!data.deviceId) {
      console.error('Device ID is missing. Cannot send notification.');
      this.client.send('notification.error', data);
      return;
    }

    if (data.type !== 'device') {
      console.error('Unsupported notification type:', data.type);
      this.client.send('notification.error', data);
      return;
    }

    if (!data.message) {
      console.error('Message content is empty. Cannot send notification.');
      this.client.send('notification.error', data);
      return;
    }

    if (!data.identifier) {
      console.error('Identifier is missing. Cannot track notification.');
      this.client.send('notification.error', data);
      return;
    }

    console.time('notificationService');
    try {
      await app.messaging().send({
        token: data.deviceId,
        notification: {
          title: 'Incoming message',
          body: data.message || '',
        },
      });
      //   TODO: save to database notification history
      await this.repository.save({
        identifier: data.identifier,
        deliverAt: new Date(),
      });
      console.timeEnd('notificationService');
      return this.client.emit('notification.done', data);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      console.timeEnd('notificationService');
    }
  }
}
