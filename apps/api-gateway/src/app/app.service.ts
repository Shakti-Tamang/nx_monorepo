import { Inject, Injectable } from '@nestjs/common';
import { AUTH_SERVICE_RABBITMQ } from './utils/servicename';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { lastValueFrom } from 'rxjs';
import { SigninDTO } from './dto/signup.entity';
type UploadedFileType = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination?: string;
  filename?: string;
  path?: string;
  buffer: Buffer;
};
@Injectable()
export class AppService {

  
  constructor(
    @Inject(AUTH_SERVICE_RABBITMQ) private auth_client: ClientProxy,
  ) {}
  // getData(): { message: string } {
  //   return { message: 'Hello API' };
  // }

  async saveUser(dto: CreateUserDto) {
    //     emit() is fire-and-forget → no response, faster but unreliable if you need confirmation.

    // send() is request-response → waits for the microservice reply.

    // For user signup/login, use send() (RPC style) so API gateway knows if the operation succeeded.
    const result = await this.auth_client
      .send('auth-user-signup', dto)
      .toPromise();

    return result;
  }

  async loginUsers(dto: SigninDTO) {
    return await lastValueFrom(this.auth_client.send('auth-user-login', dto));
  }

  async uploadImage(file: UploadedFileType, type: string) {
    return await lastValueFrom(
      this.auth_client.send('auth-upload-image', { file, type }),
    );
  }


}
