import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('/login')
  async loginUser(@Body() body: { username: string; password: string }) {
    return 'logged in user';
  }
}
