import { Controller, Get } from '@nestjs/common';
import { AppService } from '../app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductEntity } from '../entity/product.entity';
import { ProductDto } from '../dto/product.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('save-product')
  async saveProduct(@Payload() data: ProductDto) {

    return this.appService.savePeoduct(data);

  }
}
