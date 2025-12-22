import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SigninDTO } from './dto/signup.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // getData() {
  //   return this.appService.getData();
  // }


    @MessagePattern('auth-user-signup')
  async saveAuth(@Payload() credentials: CreateUserDto) {

    console.log("datas",credentials)
    return await this.appService.signUp(credentials);
  }
  @MessagePattern('auth-user-login')
  async loginAuth(@Payload() credentials: SigninDTO) {
    return await this.appService.login(credentials);
  }
}
