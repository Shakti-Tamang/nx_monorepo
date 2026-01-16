import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from '../app.service';
import { ProductDto } from '../dto/product.dto';

@Controller('product')
export class ProductController{


    constructor(
        private readonly appServices: AppService
    ) {}

    @Post()
    async saveProduct(@Body() dto:ProductDto){

        return this.appServices.saveProduct(dto);
    }

    
}
