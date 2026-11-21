import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdvertisingRevenueService } from './advertising-revenue.service.js';
import { AdvertisingRevenueController } from './advertising-revenue.controller.js';
import { AdvertisingRevenueRecord } from './entities/advertising-revenue-record.entity.js';
import { Advertisement } from '../advertisements/entities/advertisement.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([AdvertisingRevenueRecord, Advertisement])],
  controllers: [AdvertisingRevenueController],
  providers: [AdvertisingRevenueService],
  exports: [AdvertisingRevenueService],
})
export class AdvertisingRevenueModule {}