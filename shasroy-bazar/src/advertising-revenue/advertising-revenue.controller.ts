
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import { AdvertisingRevenueService } from './advertising-revenue.service.js';

import { AdvertisingRevenueRecord } from './entities/advertising-revenue-record.entity.js';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@Controller('advertising-revenue')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdvertisingRevenueController {
  constructor(
    private readonly advertisingRevenueService: AdvertisingRevenueService,
  ) {}

  // ADMIN: GET ALL REVENUE RECORDS
  @Get()
  async getAllRevenues(): Promise<AdvertisingRevenueRecord[]> {
    return await this.advertisingRevenueService.getAllRevenues();
  }

  // ADMIN: GET REVENUE RECORD BY ID
  @Get(':id')
  async getRevenueById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AdvertisingRevenueRecord> {
    return await this.advertisingRevenueService.getRevenueById(id);
  }
}
