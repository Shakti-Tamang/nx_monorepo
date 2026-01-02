import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AppService } from '../app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileType } from '../dto/file-type';


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

@Controller('uploadimages')
@ApiTags('uploadimages')
export class UploadImages {
  constructor(private readonly appServices: AppService) {}
// upload image 
  @UseInterceptors(FileInterceptor('file'))
  @Post('/uploadFile')
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
          enum: Object.values(FileType),
        },
      },
    },
  })
  async saveImages(
    @UploadedFile() file: UploadedFileType,
    @Body('type') type: FileType,
  ) {
    // Check if file exists
    if (!file) {
      return {
        success: false,
        message: 'No file uploaded',
      };
    }

    // Process the file
    const fileInfo = {
      originalName: file.originalname,
      mimeType: file.mimetype,
      sizeInBytes: file.size,
      sizeInMB: (file.size / (1024 * 1024)).toFixed(2),
      type: type,
    };


    await this.appServices.uploadImage(file, type);
    return {
      success: true,
      message: 'File uploaded successfully',
      data: fileInfo,
    };
  }
}