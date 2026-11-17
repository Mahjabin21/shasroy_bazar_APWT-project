import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { AdvertisingRevenueService } from './advertising-revenue.service.js';
import { CreateAdvertisingRevenueDto } from './dto/create-advertising-revenue.dto.js';
import { UpdateAdvertisingRevenueDto } from './dto/update-advertising-revenue.dto.js';
import { AdvertisingRevenueRecord } from './entities/advertising-revenue-record.entity.js';

@Controller('advertising-revenue')
export class AdvertisingRevenueController {
  constructor(
    private readonly advertisingRevenueService: AdvertisingRevenueService,
  ) {}

  @Post('create-revenue')
  async createRevenue(
    @Body() revenue: CreateAdvertisingRevenueDto,
  ): Promise<AdvertisingRevenueRecord> {
    return await this.advertisingRevenueService.createRevenue(revenue);
  }

  @Get()
  async getAllRevenues(): Promise<AdvertisingRevenueRecord[]> {
    return await this.advertisingRevenueService.getAllRevenues();
  }

  @Get(':id')
  async getRevenueById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AdvertisingRevenueRecord> {
    return await this.advertisingRevenueService.getRevenueById(id);
  }

  @Patch('update-revenue/:id')
  async updateRevenue(
    @Param('id', ParseIntPipe) id: number,
    @Body() revenue: UpdateAdvertisingRevenueDto,
  ): Promise<string> {
    return await this.advertisingRevenueService.updateRevenue(id, revenue);
  }

  @Delete(':id')
  async deleteRevenue(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<string> {
    return await this.advertisingRevenueService.deleteRevenue(id);
  }
}