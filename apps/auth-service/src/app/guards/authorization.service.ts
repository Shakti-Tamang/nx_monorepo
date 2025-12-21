import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Authorization } from '../entity/auth.entity';
import { Role } from '../entity/role.entity';

@Injectable()
export class AuthorizationService {
  constructor(
    @InjectRepository(Authorization)
    private readonly authorizationRepository: Repository<Authorization>,
  ) {}

  async isAuthorized(role: Role, path: string, method: string): Promise<boolean> {
    const authorization = await this.authorizationRepository.findOne({
      where: {
        role: { id: role.id },
        path,
      },
      relations: ['role'],
    });

    if (!authorization) {
      return false;
    }

    return authorization.methods.includes(method);
  }
}