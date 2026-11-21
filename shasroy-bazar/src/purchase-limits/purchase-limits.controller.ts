import { ApiBody, ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';

import { PurchaseLimitsService } from './purchase-limits.service.js';
import { SetPurchaseLimitDto } from './dto/set-purchase-limit.dto.js';

import { PurchaseLimitEntity } from './entities/purchase-limit.entity.js';
import { PurchaseLimitTrackingEntity } from './entities/purchase-limit-tracking.entity.js';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@ApiTags('Purchase Limits')
@ApiBearerAuth()
@Controller('purchase-limits')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class PurchaseLimitsController {
  constructor(
    private readonly purchaseLimitsService: PurchaseLimitsService,
  ) {}

  // 1. Set purchase limit
  @Post('set-limit')
  @ApiBody({
    schema: {
      example: {
        listing_id: 1,
        max_quantity: 3,
        period_type: 'daily',
      },
    },
  })
  async setLimit(
    @Body() dto: SetPurchaseLimitDto,
  ): Promise<PurchaseLimitEntity> {
    return await this.purchaseLimitsService.setLimit(dto);
  }

  // 2. Get all purchase limits
  @Get()
  async getAllLimits(): Promise<PurchaseLimitEntity[]> {
    return await this.purchaseLimitsService.getAllLimits();
  }

  // 3. Get limit by listing ID
  @Get('listing/:listingId')
  async getLimitByListing(
    @Param('listingId', ParseIntPipe) listingId: number,
  ): Promise<PurchaseLimitEntity> {
    return await this.purchaseLimitsService.getLimitByListing(listingId);
  }

  // 4. Get purchase tracking by user ID
  @Get('tracking/user/:userId')
  async getUserTracking(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<PurchaseLimitTrackingEntity[]> {
    return await this.purchaseLimitsService.getUserTracking(userId);
  }

  // 5. Delete purchase limit
  @Delete(':id')
  async deleteLimit(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<string> {
    return await this.purchaseLimitsService.deleteLimit(id);
  }
}
