import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { AppService } from '../app.service';
import { ApiTags } from '@nestjs/swagger';
import { SigninDTO } from '../dto/signup.entity';
import { SkipThrottle } from '@nestjs/throttler';
// https://app.diagrams.net/#G1h4oxI385x7oLRLrPHLxn-KExfW5pDZ-X#%7B%22pageId%22%3A%229-cCP9uj-jJiMKpI8JQj%22%7D
@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly appServices: AppService) {

  }

  @Post()
  async saveAuthUser(@Body() dto: CreateUserDto) {
    return await this.appServices.saveUser(dto);
  }
  @Post('/login')
  async loginUser(@Body() dto: SigninDTO) {
    return await this.appServices.loginUsers(dto);
  }
  @Get('/hello')
//  @SkipThrottle({ short: true, medium: true, long: true })
  getHello(): string {
    return 'Hello Auth Service';
  }
}
