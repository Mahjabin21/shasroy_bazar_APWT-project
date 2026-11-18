import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdvertisingRevenueService } from './advertising-revenue.service.js';
import { CreateAdvertisingRevenueDto } from './dto/create-advertising-revenue.dto.js';
import { UpdateAdvertisingRevenueDto } from './dto/update-advertising-revenue.dto.js';
import { AdvertisingRevenueRecord } from './entities/advertising-revenue-record.entity.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@Controller('advertising-revenue')
export class AdvertisingRevenueController {
  constructor(
    private readonly advertisingRevenueService: AdvertisingRevenueService,
  ) {}

  @Post('create-revenue')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async createRevenue(
    @Body() revenue: CreateAdvertisingRevenueDto,
  ): Promise<AdvertisingRevenueRecord> {
    return await this.advertisingRevenueService.createRevenue(revenue);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getAllRevenues(): Promise<AdvertisingRevenueRecord[]> {
    return await this.advertisingRevenueService.getAllRevenues();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getRevenueById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AdvertisingRevenueRecord> {
    return await this.advertisingRevenueService.getRevenueById(id);
  }

  @Patch('update-revenue/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateRevenue(
    @Param('id', ParseIntPipe) id: number,
    @Body() revenue: UpdateAdvertisingRevenueDto,
  ): Promise<string> {
    return await this.advertisingRevenueService.updateRevenue(id, revenue);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteRevenue(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<string> {
    return await this.advertisingRevenueService.deleteRevenue(id);
  }
}