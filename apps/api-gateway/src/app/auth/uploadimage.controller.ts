import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from '../app.service';
import { FileType } from '../dto/file-type';

@Controller('uploadimages')
@ApiTags('uploadimages')
export class UploadImages {
  constructor(private readonly appServices: AppService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        type: {
          type: 'string',
          example: 'PROFILE',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type: FileType,
  ) {
    return this.appServices.uploadImage(file, type);
  }
}
