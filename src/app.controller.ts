/* eslint-disable prettier/prettier */
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { nanoid } from 'nanoid';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('NOTIFICATION_RMQ')
    private readonly client: ClientProxy,
  ) {}

  @Post()
  sendMessage(
    @Body() message: { content: string; device_id: string },
  ): {
    status: string;
    data: { content: string; device_id: string };
  } {
    this.client.emit('notification.fcm.send', {
      identifier: `fcm-msg-${nanoid()}`,
      type: 'device',
      message: message.content,
      deviceId: message.device_id,
    });
    return {
      status: 'Message sent to notification service',
      data: message,
    };
  }
}
