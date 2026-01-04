import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';



// nx reset
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // getData() {
  //   return this.appService.getData();
  // }
}
