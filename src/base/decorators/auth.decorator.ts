import { OTPGuard } from '@base/guards/otp.guard';
import { UseGuards, applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt.guard';

export function Auth() {
  return applyDecorators(
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: '401 - Unauthorized' }),
    ApiForbiddenResponse({ description: '403 - Forbidden' }),
  );
}
export function OTPAuth() {
  return applyDecorators(
    UseGuards(OTPGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: '401 - Unauthorized' }),
    ApiForbiddenResponse({ description: '403 - Forbidden' }),
  );
}
