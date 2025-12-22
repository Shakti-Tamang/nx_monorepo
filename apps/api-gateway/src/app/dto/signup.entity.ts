import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";



export class SigninDTO {
  
    @IsString()
    @IsOptional()
    organization!: string;
  
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email!: string;
  
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password!: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsOptional()
    fcmToken!: string;
  }