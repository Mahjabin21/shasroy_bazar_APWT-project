
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

@Controller('purchase-limits')
export class PurchaseLimitsController {
  constructor(
    private readonly purchaseLimitsService: PurchaseLimitsService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('set-limit')
  async setLimit(
    @Body() dto: SetPurchaseLimitDto,
  ): Promise<PurchaseLimitEntity> {
    return await this.purchaseLimitsService.setLimit(dto);
  }

  @Get()
  async getAllLimits(): Promise<PurchaseLimitEntity[]> {
    return await this.purchaseLimitsService.getAllLimits();
  }

  @Get('listing/:listingId')
  async getLimitByListing(
    @Param('listingId', ParseIntPipe) listingId: number,
  ): Promise<PurchaseLimitEntity> {
    return await this.purchaseLimitsService.getLimitByListing(listingId);
  }

  @Get('tracking/user/:userId')
  async getUserTracking(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<PurchaseLimitTrackingEntity[]> {
    return await this.purchaseLimitsService.getUserTracking(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async deleteLimit(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<string> {
    return await this.purchaseLimitsService.deleteLimit(id);
  }
}
