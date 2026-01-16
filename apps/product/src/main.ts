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
  await app.listen(3012);


  // Dead Letter Exchange (DLX)
// In your microservice options:
const microservice = app.connectMicroservice<MicroserviceOptions>({
  transport: Transport.RMQ,
  options: {
    urls: [RABBITMQ_URL],
    queue: 'product_queue',
    queueOptions: { 
      durable: true,
      arguments: {
        'x-dead-letter-exchange': 'dlx.product',  // Failed messages go here
        'x-dead-letter-routing-key': 'failed.product'
      }
    },
    noAck: false,
    prefetchCount: 10,
  },
});
  //   Set noAck: false (manual ack)

  // Ack after successful DB insert

  // If DB fails → message goes back to queue → retry

  // Consider Dead Letter Queue for failed messages

  // nx run auth-service:seed

  await microservice.listen();
  Logger.log(`🚀 Application is running on: http://localhost:`);
}

bootstrap();

