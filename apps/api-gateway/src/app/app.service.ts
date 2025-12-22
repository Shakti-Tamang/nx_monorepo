import { Inject, Injectable } from '@nestjs/common';
import { AUTH_SERVICE_RABBITMQ } from './utils/servicename';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AppService {

  constructor(@Inject(AUTH_SERVICE_RABBITMQ) private auth_client:ClientProxy){

  }
  // getData(): { message: string } {
  //   return { message: 'Hello API' };
  // }

  async saveUser(dto:CreateUserDto){

      return await lastValueFrom(
      this.auth_client.send('auth-user-signup', dto),
    );

  }
}
