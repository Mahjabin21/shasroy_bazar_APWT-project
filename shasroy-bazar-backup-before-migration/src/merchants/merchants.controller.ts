import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request as NestRequest,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import type { Request } from 'express';

import { MerchantsService } from './merchants.service.js';
import { CreateMerchantDto } from './dto/create-merchant.dto.js';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';

type AuthenticatedMerchantRequest = Request & {
  user: {
    userId: number;
    merchantId: number;
    role: string;
  };
};

@ApiBearerAuth('JWT-auth')
@Controller('merchants')
export class MerchantsController {
  constructor(
    private readonly merchantsService: MerchantsService,
  ) {}

  // Merchant registration endpoint
  @Post('register')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  register(
    @NestRequest() req: Request & {
      user: {
        userId: number;
        role: string;
      };
    },
    @Body() createMerchantDto: CreateMerchantDto,
  ) {
    return this.merchantsService.register(
      req.user.userId,
      createMerchantDto,
    );
  }

  // Merchant profile endpoint
  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('merchant')
  getProfile(@NestRequest() req: AuthenticatedMerchantRequest) {
    return this.merchantsService.getProfile(req.user.userId);
  }
}