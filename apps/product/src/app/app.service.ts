import { Inject, Injectable } from '@nestjs/common';
import { ProductDto } from './dto/product.dto';
import { ProductEntity } from './entity/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UPLOAD_SERVICE_RABBITMQ } from './utils/servicename';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {

constructor(
  @InjectRepository(ProductEntity)
  private readonly productRepository: Repository<ProductEntity>,

  @Inject(UPLOAD_SERVICE_RABBITMQ)  private upload_client: ClientProxy,
) {}

async savePeoduct(dto: ProductDto) {

  this.productRepository.save(dto);
  return { message: 'Product saved successfully' };


}

}
