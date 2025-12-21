import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @MessagePattern('auth-user')

  async loginAuth(@Payload() credentials:{username:string,password:string}){

    return await this.appService.logIn(credentials);

  }
}
