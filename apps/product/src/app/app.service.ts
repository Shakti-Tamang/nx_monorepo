import { Inject, Injectable } from '@nestjs/common';
import { ProductDto } from './dto/product.dto';
import { ProductEntity } from './entity/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IMAGE_FETCH_SERVICE_RABBITMQ,
  UPLOAD_SERVICE_RABBITMQ,
} from './utils/servicename';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    @Inject(UPLOAD_SERVICE_RABBITMQ) private upload_client: ClientProxy,

    @Inject(IMAGE_FETCH_SERVICE_RABBITMQ) private fetch_client: ClientProxy,
  ) {}

  async savePeoduct(dto: ProductDto) {
    // 1️⃣ Check image existence
    const result = await lastValueFrom(
      this.upload_client.send(
        'image.exists',
        JSON.stringify({ imageIds: dto.imageIds }),
      ),
    );

    if (!result.exists) {
      throw new Error('One or more images do not exist');
    }

    // 2️⃣ Save product
    await this.productRepository.save(dto);

    return { message: 'Product saved successfully' };
  }

  async getAllProducts() {
    // Fetch all products from the database
    const products = await this.productRepository.find();

    // Process each product and fetch its images
    const result = await Promise.all(
      products.map(async (product) => {
        try {
          // Send RPC message to fetch images (NestJS wrapper expects `data`)
          const imageResult = await lastValueFrom(
            this.fetch_client.send('image.fetch', {
              data: { imageIds: product.imageIds },
            }),
          );

          return {
            ...product,
            images: imageResult?.images || [], 
            imageCount: imageResult?.count || 0,
          };
        } catch (err: unknown) {
          // Type-safe handling for unknown errors
          const errorMessage =
            err instanceof Error
              ? err.message
              : 'Unknown error while fetching images';
          console.error(
            `Failed to fetch images for product ${product.id}:`,
            errorMessage,
          );

          return {
            ...product,
            images: [],
            imageCount: 0,
          };
        }
      }),
    );

    return result;
  }
}
