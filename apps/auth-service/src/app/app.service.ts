import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  async logIn(credentials: { username: string; password: string }) {
    if (
      credentials.username === 'Admin' ||
      credentials.password === 'password'
    ) {
      return 'success';
    }
  }
}
