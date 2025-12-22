import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { user } from './entity/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtPayload } from './interface/jwtplayload';
import { StringUtils } from './utilities/stringutils';
import { SigninDTO } from './dto/signup.entity';
import * as bcrypt from 'bcryptjs';
import type ms from 'ms';
@Injectable()
export class AppService {
  constructor(
    @InjectRepository(user)
    private readonly userRepository: Repository<user>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  /**
   * Generates an access token using the provided payload.
   * @param payload - JWT payload containing user information.
   * @returns Access token as a string.
   */
  generateAccessToken(payload: JwtPayload): string {
   return this.jwtService.sign(payload, {
    expiresIn: this.configService.getOrThrow<ms.StringValue>(
      'ACCESS_TOKEN_EXPIRY',
    ),
  });
  }

  /**
   * Generates a refresh token using the provided payload.
   * @param payload - JWT payload containing user information.
   * @returns Refresh token as a string.
   */
generateRefreshToken(payload: JwtPayload): string {
  return this.jwtService.sign(payload, {
    expiresIn: this.configService.getOrThrow<ms.StringValue>(
      'REFRESH_TOKEN_EXPIRY',
    ),
  });
}


  /**
   * Generates a new access token from a valid refresh token.
   * @param refreshToken - Refresh token as a string.
   * @returns New access token as a string.
   * @throws UnauthorizedException if the refresh token is invalid or expired.
   */
  generateAccessTokenFromRefreshToken(refreshToken: string): string {
    try {
      const decoded: JwtPayload = this.jwtService.verify(refreshToken);
      return this.generateAccessToken(decoded);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Handles user signup process.
   * @param signUpRequest - Data transfer object containing user signup information.
   * @returns A promise that resolves with a success message.
   */

  async signUp(
    signUpRequest: CreateUserDto
  ): Promise<{ message: string; userId?: string }> {
  
    const existingUser = await this.userRepository.findOne({
      where: { email: signUpRequest.email },
    });

    if (existingUser) {
      throw new ConflictException(`Email ${signUpRequest.email} is already registered`);
    }



    const userEntity = this.userRepository.create({
      id: StringUtils.generateRandomAlphaNumeric(4),
      name: signUpRequest.name,
      email: signUpRequest.email,
      // password will be hashed below
      role: signUpRequest.role ?? undefined,
      address: signUpRequest.address ?? null,
      contactNumber: signUpRequest.contactNumber ?? null,
    } as Partial<user>);

    const hashedPassword = await bcrypt.hash(signUpRequest.password, 10);
    userEntity.password = hashedPassword;


    const saved = await this.userRepository.save(userEntity);

    return {
      message: 'User registered successfully',
      userId: saved.id,
    };
  }

  /**
   * Handles user login process.
   * @param signInDTO - Data transfer object containing user login information.
   * @returns A promise that resolves with JWT tokens and user information.
   * @throws UnauthorizedException if credentials are invalid.
   */
  async login(signInDTO: SigninDTO) {
    const query = this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: signInDTO.email });

 

    const user = await query.getOne();

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(
      signInDTO.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const {  ...safeUser } = user;

    await this.userRepository.save(user);
    const payload: JwtPayload = {
      sub: user.id,
      name: user.name,
      role: user.role,
      address: user.address,
      contact: user.contactNumber,

  
    };

    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
      user: safeUser,
    };
  }

}
