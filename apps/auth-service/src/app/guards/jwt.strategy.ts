import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { user } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from '../interface/jwtplayload';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(user)
    private readonly userRepository: Repository<user>,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: JwtPayload): Promise<user> {
    const foundUser = await this.userRepository.findOne({ where: { id: payload.sub } });
    if (!foundUser) {
      throw new UnauthorizedException('User not found');
    }
    return foundUser;
  }
}
