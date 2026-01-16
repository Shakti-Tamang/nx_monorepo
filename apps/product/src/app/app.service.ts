import { Inject, Injectable } from '@nestjs/common';
import { ProductDto } from './dto/product.dto';
import { ProductEntity } from './entity/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UPLOAD_SERVICE_RABBITMQ } from './utils/servicename';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    @Inject(UPLOAD_SERVICE_RABBITMQ) private upload_client: ClientProxy,
  ) {}

  async savePeoduct(dto: ProductDto) {
    // 1️⃣ Check image existence
    const result = await lastValueFrom(
  this.upload_client.send('image.exists', JSON.stringify({ imageIds: dto.imageIds }))
    );

    if (!result.exists) {
      throw new Error('One or more images do not exist');
    }

    // 2️⃣ Save product
    await this.productRepository.save(dto);

    return { message: 'Product saved successfully' };
  }

  async getAllProducts() {
    const allProducts= await this.productRepository.find();

    const productsWithImages= await Promise.all(
      allProducts.map(async (product) => {
        const imageResult = await lastValueFrom(
          this.upload_client.send('image.fetch', JSON.stringify({ imageIds: product.imageIds }))
        );
        
        return {
          ...product,
          images: imageResult.images,
        };
      }
    );
    
    return productsWithImages;
    
  }
}
