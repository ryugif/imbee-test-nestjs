import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { rabbitMQConfig } from './configs/rabbitmq.config';
import { ClientsModule } from '@nestjs/microservices';
import { NotificationModule } from './notification/notification.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './configs/config.service';

console.log('Database Config:', configService.getTypeOrmConfig());
@Module({
  imports: [
    NotificationModule,
    ClientsModule.registerAsync([
      {
        name: 'NOTIFICATION_RMQ',
        useFactory: rabbitMQConfig,
      },
    ]),
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
