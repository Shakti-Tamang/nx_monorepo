import { Inject, Injectable } from '@nestjs/common';
import {
  AUTH_SERVICE_RABBITMQ,
  PRODUCT_SERVICE_RABBITMQ,
  UPLOAD_SERVICE_RABBITMQ,
} from './utils/servicename';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { lastValueFrom } from 'rxjs';
import { SigninDTO } from './dto/signup.entity';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class AppService {
  constructor(
    @Inject(AUTH_SERVICE_RABBITMQ) private auth_client: ClientProxy,
    @Inject(UPLOAD_SERVICE_RABBITMQ) private upload_client: ClientProxy,
    @Inject(PRODUCT_SERVICE_RABBITMQ) private product_client: ClientProxy,
  ) {}

  async saveUser(dto: CreateUserDto) {
    return await lastValueFrom(this.auth_client.send('auth-user-signup', dto));
  }

  async loginUsers(dto: SigninDTO) {
    return await lastValueFrom(this.auth_client.send('auth-user-login', dto));
  }

  async uploadImage(file: Express.Multer.File, type: string) {
    if (!file) {
      throw new Error('File not received');
    }

    // Convert to Base64
    const base64Data = file.buffer.toString('base64');

    // Create payload
    const payload = {
      filename: file.originalname,
      imageType: type.toUpperCase(),
      mimetype: file.mimetype,
      size: file.size,
      data: base64Data,
    };

    // Convert to JSON string to avoid NestJS wrapping
    const message = JSON.stringify(payload);

    // Emit as plain string
    this.upload_client.emit('image.upload', message);

    return {
      queued: true,
      filename: file.originalname,
      size: file.size,
    };
  }

  async saveProduct(dto: ProductDto) {
    return await lastValueFrom(this.product_client.send('save-product', dto));
  }

  async getAllProductsWithImage() {
    return await lastValueFrom(
      this.product_client.send('getProduct', {}), 
    );
  }
}
