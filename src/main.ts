import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { rabbitMQConfig } from './configs/rabbitmq.config';

async function bootstrap() {
  // const api = await NestFactory.create(AppModule);
  // await api.listen(process.env.PORT ?? 3000);
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice(rabbitMQConfig());

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
