import { Transport, RmqOptions } from '@nestjs/microservices';

export const rabbitMQConfig = (): RmqOptions => ({
  transport: Transport.RMQ,
  options: {
    urls: [
      `amqp://${process.env.RABBITMQ_USER || 'guest'}:${
        process.env.RABBITMQ_PASSWORD || 'guest'
      }@rabbitmq:${process.env.RABBITMQ_PORT || 5672}${
        process.env.RABBITMQ_VHOST || '/'
      }`,
    ],
    queue: 'notification.fcm',
    queueOptions: {
      durable: false,
      exclusive: false,
    },
    noAck: true,
    prefetchCount: 10,
    socketOptions: {
      noDelay: true,
    },
  },
});
