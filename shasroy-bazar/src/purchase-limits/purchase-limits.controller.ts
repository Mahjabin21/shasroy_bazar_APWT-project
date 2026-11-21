<<<<<<< HEAD
import { ApiBody, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
=======


import { ApiBody } from '@nestjs/swagger';
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361

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
<<<<<<< HEAD

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
=======
import { PurchaseLimitsService } from './purchase-limits.service.js';
import { SetPurchaseLimitDto } from './dto/set-purchase-limit.dto.js';
import { PurchaseLimitEntity } from './entities/purchase-limit.entity.js';
import { PurchaseLimitTrackingEntity } from './entities/purchase-limit-tracking.entity.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';

@Controller('purchase-limits')
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
export class PurchaseLimitsController {
  constructor(
    private readonly purchaseLimitsService: PurchaseLimitsService,
  ) {}

<<<<<<< HEAD
  // 1. Set purchase limit
  @Post('set-limit')
=======
  @UseGuards(JwtAuthGuard, RolesGuard)
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
  @ApiBody({
    schema: {
      example: {
        listing_id: 1,
        max_quantity: 3,
        period_type: 'daily',
      },
    },
  })
<<<<<<< HEAD
=======
  @Post('set-limit')
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
  async setLimit(
    @Body() dto: SetPurchaseLimitDto,
  ): Promise<PurchaseLimitEntity> {
    return await this.purchaseLimitsService.setLimit(dto);
  }

<<<<<<< HEAD
  // 2. Get all purchase limits
=======
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
  @Get()
  async getAllLimits(): Promise<PurchaseLimitEntity[]> {
    return await this.purchaseLimitsService.getAllLimits();
  }

<<<<<<< HEAD
  // 3. Get limit by listing ID
=======
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
  @Get('listing/:listingId')
  async getLimitByListing(
    @Param('listingId', ParseIntPipe) listingId: number,
  ): Promise<PurchaseLimitEntity> {
    return await this.purchaseLimitsService.getLimitByListing(listingId);
  }

<<<<<<< HEAD
  // 4. Get purchase tracking by user ID
=======
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
  @Get('tracking/user/:userId')
  async getUserTracking(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<PurchaseLimitTrackingEntity[]> {
    return await this.purchaseLimitsService.getUserTracking(userId);
  }

<<<<<<< HEAD
  // 5. Delete purchase limit
=======
  @UseGuards(JwtAuthGuard, RolesGuard)
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
  @Delete(':id')
  async deleteLimit(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<string> {
    return await this.purchaseLimitsService.deleteLimit(id);
  }
}
