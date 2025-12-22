/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './app/app.module';

import { useContainer } from 'class-validator';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';



async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule, { cors: true });
  app.enableCors();

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3001;

   const config = new DocumentBuilder()
    .setTitle('Microservices API')
    .setDescription('API documentation for microservices backend project')
    .setVersion('1.0')
    .addBearerAuth() 
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); 

  useContainer(app.select(ApiGatewayModule), { fallbackOnErrors: true });
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

// creating different services

//  nx g @nx/nest:app apps/api-gateway   


// adding nest

//  nx add @nx/nest                                       
   

// creating nx monrepo



// install nx globally

// npm i -g nx


// command to create 

// npx create-nx-workspace@latest projectname

bootstrap();
