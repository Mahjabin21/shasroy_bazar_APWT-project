import { Module } from '@nestjs/common';
import { PurchaseLimitsController } from './purchase-limits.controller.js';
import { PurchaseLimitsService } from './purchase-limits.service.js';

@Module({
  controllers: [PurchaseLimitsController],
  providers: [PurchaseLimitsService]
})
export class PurchaseLimitsModule {}
