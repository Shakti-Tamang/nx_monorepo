import { Inject, Injectable } from '@nestjs/common';
import { AUTH_SERVICE_RABBITMQ, UPLOAD_SERVICE_RABBITMQ } from './utils/servicename';
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
    @Inject(UPLOAD_SERVICE_RABBITMQ) private upload_client: ClientProxy,
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

// In app.service.ts

// In app.service.ts

// In app.service.ts

// In app.service.ts - CHANGE THIS!

async uploadImage(file: Express.Multer.File, type: string) {
  if (!file) {
    throw new Error('File not received');
  }

  // Send FLAT structure - NO nested "data" field!
  const payload = {
    filename: file.originalname,
    imageType: type,
    mimetype: file.mimetype,
    size: file.size,
    data: file.buffer.toString('base64'),  // This is now at the top level
  };

  console.log('Sending FLAT payload:', JSON.stringify(payload));

  // Send to RabbitMQ - remove the 'pattern' wrapper
  this.upload_client.emit('upload-image', payload);
  
  return { queued: true, filename: file.originalname };
}
}
