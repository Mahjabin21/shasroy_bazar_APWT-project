
import { Controller } from '@nestjs/common';
import { PurchaseLimitsService } from './purchase-limits.service.js';

@Controller('purchase-limits')
export class PurchaseLimitsController {
  constructor(
    private readonly purchaseLimitsService: PurchaseLimitsService,
  ) {}
}
