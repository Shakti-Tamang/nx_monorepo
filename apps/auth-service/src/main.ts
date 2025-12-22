/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
  const RABBITMQ_URL = 'amqp://guest:guest@localhost:5672';
  app.enableCors();
  await app.listen(3009);

  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [RABBITMQ_URL],
      queue: 'auth_queue',
      queueOptions: { durable: true },
        noAck: false, // ensure messages are acknowledged
      prefetchCount: 10, // process multiple messages in parallel
    },
  });

  await microservice.listen();
  Logger.log(
    `🚀 Application is running on: http://localhost:`,
  );
}

bootstrap();
