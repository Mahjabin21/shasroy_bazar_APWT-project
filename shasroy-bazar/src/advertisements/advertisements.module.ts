
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdvertisementsService } from './advertisements.service.js';
import { AdvertisementsController } from './advertisements.controller.js';

import { Advertisement } from './entities/advertisement.entity.js';
import { AdvertisementReview } from './entities/advertisement-review.entity.js';
import { AdvertisingPaymentEntity } from './entities/advertising-payment.entity.js';

import { Organization } from '../organizations/entities/organization.entity.js';
import { AdvertisingRevenueRecord } from '../advertising-revenue/entities/advertising-revenue-record.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Advertisement,
      AdvertisementReview,
      AdvertisingPaymentEntity,
      Organization,
      AdvertisingRevenueRecord,
    ]),
  ],
  controllers: [AdvertisementsController],
  providers: [AdvertisementsService],
  exports: [AdvertisementsService],
})
export class AdvertisementsModule {}
