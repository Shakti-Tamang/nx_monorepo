import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderserviceService } from './orderservice/orderservice.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService,OrderserviceService],
})
export class AppModule {}
