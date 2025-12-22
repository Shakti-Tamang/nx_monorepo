import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { AppService } from '../app.service';
import { ApiTags } from '@nestjs/swagger';
import { SigninDTO } from '../dto/signup.entity';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly appServices: AppService) {}

  @Post()
  async saveAuthUser(@Body() dto: CreateUserDto) {
    return await this.appServices.saveUser(dto);
  }
  @Post('/login')
  async loginUser(@Body() dto: SigninDTO) {
    return await this.appServices.loginUsers(dto);
  }
}
