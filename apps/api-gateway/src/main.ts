/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './app/app.module';


async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3001;
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
