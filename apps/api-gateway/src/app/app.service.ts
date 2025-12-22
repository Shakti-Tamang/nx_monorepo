import { Inject, Injectable } from '@nestjs/common';
import { AUTH_SERVICE_RABBITMQ } from './utils/servicename';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { lastValueFrom } from 'rxjs';
import { SigninDTO } from './dto/signup.entity';

@Injectable()
export class AppService {
  constructor(
    @Inject(AUTH_SERVICE_RABBITMQ) private auth_client: ClientProxy,
  ) {}
  // getData(): { message: string } {
  //   return { message: 'Hello API' };
  // }

  async saveUser(dto: CreateUserDto) {
    const result = await this.auth_client
      .send('auth-user-signup', dto)
      .toPromise();

    return result;
  }

  async loginUsers(dto: SigninDTO) {
    return await lastValueFrom(this.auth_client.send('auth-user-login', dto));
  }
}
