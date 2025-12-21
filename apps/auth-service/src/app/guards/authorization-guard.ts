import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entity/role.entity';
import { AuthorizationService } from './authorization.service';




@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>, // Inject Role repository
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const path = request.route.path;
    const method = request.method;

    console.log('AuthorizationGuard - User:', user);

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    // Fetch the full Role object from the database
    const role = await this.roleRepository.findOne({
      where: { role: user.role }, // Assuming user.role is the role name (e.g., "ADMIN")
    });

    if (!role) {
      throw new ForbiddenException('Role not found');
    }

    // Check if the user is authorized for the specific path and method
    const isAuthorized = await this.authorizationService.isAuthorized(
      role, // Pass the full Role object
      path,
      method
    );

    if (!isAuthorized) {
      throw new ForbiddenException('Access denied. You do not have permission to access this endpoint.');
    }

    return true;
  }
}