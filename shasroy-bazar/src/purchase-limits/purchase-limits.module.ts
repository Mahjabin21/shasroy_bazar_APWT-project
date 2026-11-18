import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseLimitsController } from './purchase-limits.controller.js';
import { PurchaseLimitsService } from './purchase-limits.service.js';
import { PurchaseLimitEntity } from './entities/purchase-limit.entity.js';
import { PurchaseLimitTrackingEntity } from './entities/purchase-limit-tracking.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([PurchaseLimitEntity, PurchaseLimitTrackingEntity]),
  ],
  controllers: [PurchaseLimitsController],
  providers: [PurchaseLimitsService],
  exports: [PurchaseLimitsService],
})
export class PurchaseLimitsModule {}
