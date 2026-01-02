// src/guards/custom-throttler.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';
import { Request } from 'express';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected override async getTracker(req: Request): Promise<string> {
    // Custom tracking logic - IP + User Agent
    const ip = req.headers['x-forwarded-for'] || req.ip;
    const userAgent = req.headers['user-agent'] || 'unknown';
    return `${ip}-${userAgent}`;
  }

  protected override async throwThrottlingException(context: ExecutionContext): Promise<void> {
    // Custom error message with retry info
    const req = context.switchToHttp().getRequest();
    const url = req.url;
    const ip = req.headers['x-forwarded-for'] || req.ip;
    
    console.warn(`Rate limit exceeded for IP: ${ip}, Path: ${url}`);
    
    throw new ThrottlerException(
      `Too many requests from your device. Please try again later.`,
    );
  }
}