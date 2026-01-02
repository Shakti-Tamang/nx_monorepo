// src/guards/custom-throttler.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common';
import {
  ThrottlerGuard,
  ThrottlerException,
  ThrottlerLimitDetail,
} from '@nestjs/throttler';
import { Reflector } from '@nestjs/core';
import type { ThrottlerStorage } from '@nestjs/throttler/dist/throttler-storage.interface';
import type { ThrottlerModuleOptions } from '@nestjs/throttler/dist/throttler-module-options.interface';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  constructor(
    options: ThrottlerModuleOptions,
    storageService: ThrottlerStorage,
    reflector: Reflector,
  ) {
    super(options, storageService, reflector);
  }

  override async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check for @SkipThrottle() metadata using the string key
    const skipThrottle = this.reflector.getAllAndOverride(
      'throttler:skip',
      [context.getHandler(), context.getClass()],
    );

    console.log('Skip throttle metadata:', skipThrottle, 'for route:', context.getHandler().name);

    // If skipThrottle is true, skip ALL throttling
    if (skipThrottle === true) {
      console.log('Skipping throttle for:', context.getHandler().name);
      return true;
    }

    // Check if it's an object (for named throttlers like {short: true, medium: true})
    if (typeof skipThrottle === 'object' && skipThrottle !== null) {
      console.log('Skip throttle object:', skipThrottle);
      
      // Check if all named throttlers should be skipped
      const throttlerNames = ['short', 'medium', 'long'];
      const shouldSkipAll = throttlerNames.every(
        name => skipThrottle[name] === true
      );
      
      if (shouldSkipAll) {
        console.log('Skipping all named throttlers for:', context.getHandler().name);
        return true;
      }
    }

    return super.canActivate(context);
  }

  protected override async getTracker(
    req: Record<string, any>,
  ): Promise<string> {
    const ip = req.headers?.['x-forwarded-for'] || req.ip || 'unknown-ip';
    const userAgent = req.headers?.['user-agent'] || 'unknown-agent';
    return `${ip}-${userAgent}`;
  }

  protected override async throwThrottlingException(
    context: ExecutionContext,
    throttlerLimitDetail: ThrottlerLimitDetail,
  ): Promise<void> {
    const req = context.switchToHttp().getRequest();

    console.warn(
      `Rate limit exceeded | IP: ${req.ip} | Path: ${req.url} | Limit: ${throttlerLimitDetail.limit}`,
    );

    throw new ThrottlerException('Too many requests. Please try again later.');
  }
}