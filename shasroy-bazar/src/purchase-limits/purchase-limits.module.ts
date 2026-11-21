<<<<<<< HEAD

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PurchaseLimitsController } from './purchase-limits.controller.js';
import { PurchaseLimitsService } from './purchase-limits.service.js';

import { PurchaseLimitEntity } from './entities/purchase-limit.entity.js';
import { PurchaseLimitTrackingEntity } from './entities/purchase-limit-tracking.entity.js';

import { ProductBundle } from '../bundles/entities/product-bundle.entity.js';
import { BundleItem } from '../bundles/entities/bundle-item.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PurchaseLimitEntity,
      PurchaseLimitTrackingEntity,
      ProductBundle,
      BundleItem,
    ]),
=======
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseLimitsController } from './purchase-limits.controller.js';
import { PurchaseLimitsService } from './purchase-limits.service.js';
import { PurchaseLimitEntity } from './entities/purchase-limit.entity.js';
import { PurchaseLimitTrackingEntity } from './entities/purchase-limit-tracking.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([PurchaseLimitEntity, PurchaseLimitTrackingEntity]),
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
  ],
  controllers: [PurchaseLimitsController],
  providers: [PurchaseLimitsService],
  exports: [PurchaseLimitsService],
})
export class PurchaseLimitsModule {}
