<<<<<<< HEAD

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
=======
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdvertisementsService } from './advertisements.service.js';
import { AdvertisementsController } from './advertisements.controller.js';
import { Advertisement } from './entities/advertisement.entity.js';
import { Organization } from '../organizations/entities/organization.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Advertisement, Organization])],
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
  controllers: [AdvertisementsController],
  providers: [AdvertisementsService],
  exports: [AdvertisementsService],
})
<<<<<<< HEAD
export class AdvertisementsModule {}
=======
export class AdvertisementsModule {}
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
