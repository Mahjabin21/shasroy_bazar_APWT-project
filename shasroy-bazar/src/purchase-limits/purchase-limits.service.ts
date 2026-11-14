
import { Injectable } from '@nestjs/common';

@Injectable()
export class PurchaseLimitsService {

  isValidTrackingPeriod(
    periodStart: Date,
    periodEnd: Date,
  ): boolean {

    if (
      !(periodStart instanceof Date) ||
      !(periodEnd instanceof Date)
    ) {
      return false;
    }

    if (
      Number.isNaN(periodStart.getTime()) ||
      Number.isNaN(periodEnd.getTime())
    ) {
      return false;
    }

    return periodEnd.getTime() > periodStart.getTime();
  }
}

