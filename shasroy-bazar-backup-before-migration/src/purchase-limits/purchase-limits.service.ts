
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThan, Repository } from 'typeorm';
import { PurchaseLimitEntity } from './entities/purchase-limit.entity.js';
import { PurchaseLimitTrackingEntity } from './entities/purchase-limit-tracking.entity.js';
import { SetPurchaseLimitDto } from './dto/set-purchase-limit.dto.js';

@Injectable()
export class PurchaseLimitsService {
  constructor(
    @InjectRepository(PurchaseLimitEntity)
    private readonly limitRepo: Repository<PurchaseLimitEntity>,
    @InjectRepository(PurchaseLimitTrackingEntity)
    private readonly trackingRepo: Repository<PurchaseLimitTrackingEntity>,
  ) {}

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

  async setLimit(dto: SetPurchaseLimitDto): Promise<PurchaseLimitEntity> {
    const existing = await this.limitRepo.findOne({
      where: { listing_id: dto.listing_id },
    });

    if (existing) {
      existing.max_quantity = dto.max_quantity;
      existing.period_type = dto.period_type ?? existing.period_type;
      return await this.limitRepo.save(existing);
    }

    const newLimit = this.limitRepo.create({
      listing_id: dto.listing_id,
      max_quantity: dto.max_quantity,
      period_type: dto.period_type ?? 'daily',
    });
    return await this.limitRepo.save(newLimit);
  }

  async getAllLimits(): Promise<PurchaseLimitEntity[]> {
    return await this.limitRepo.find();
  }

  async getLimitByListing(listingId: number): Promise<PurchaseLimitEntity> {
    const limit = await this.limitRepo.findOne({
      where: { listing_id: listingId },
    });
    if (!limit) {
      throw new NotFoundException(
        `Purchase limit for listing ${listingId} not found`,
      );
    }
    return limit;
  }

  async deleteLimit(id: number): Promise<string> {
    const result = (await this.limitRepo.delete(id)).affected;
    if (result != null && result > 0) {
      return `Purchase limit deleted with id ${id}`;
    } else {
      throw new NotFoundException(`Purchase limit with id ${id} not found`);
    }
  }

  async getUserTracking(
    userId: number,
  ): Promise<PurchaseLimitTrackingEntity[]> {
    return await this.trackingRepo.find({
      where: { user_id: userId },
      order: { period_start: 'DESC' },
    });
  }

  async checkPurchaseLimits(
    userId: number,
    items: { listing_id: number; quantity: number }[],
  ): Promise<void> {
    const quantities = this.sumQuantities(items);

    for (const [listingId, quantity] of quantities) {
      const limit = await this.limitRepo.findOne({
        where: { listing_id: listingId },
      });
      if (!limit) {
        continue;
      }

      const tracking = await this.findActiveTracking(userId, limit);
      const alreadyBought = tracking ? tracking.purchase_count : 0;

      if (alreadyBought + quantity > limit.max_quantity) {
        throw new BadRequestException(
          `Purchase limit exceeded for listing ${listingId}. ` +
            `Limit is ${limit.max_quantity} per ${limit.period_type} period, ` +
            `already purchased ${alreadyBought}, requested ${quantity}`,
        );
      }
    }
  }

  async recordPurchases(
    userId: number,
    items: { listing_id: number; quantity: number }[],
  ): Promise<void> {
    const quantities = this.sumQuantities(items);

    for (const [listingId, quantity] of quantities) {
      const limit = await this.limitRepo.findOne({
        where: { listing_id: listingId },
      });
      if (!limit) {
        continue;
      }

      const tracking = await this.findActiveTracking(userId, limit);
      if (tracking) {
        tracking.purchase_count += quantity;
        await this.trackingRepo.save(tracking);
        continue;
      }

      const periodStart = new Date();
      const periodEnd = this.getPeriodEnd(periodStart, limit.period_type);
      if (!this.isValidTrackingPeriod(periodStart, periodEnd)) {
        throw new BadRequestException('Invalid purchase limit period');
      }

      const newTracking = this.trackingRepo.create({
        user_id: userId,
        listing_id: listingId,
        period_type: limit.period_type,
        purchase_count: quantity,
        period_start: periodStart,
        period_end: periodEnd,
      });
      await this.trackingRepo.save(newTracking);
    }
  }

  private async findActiveTracking(
    userId: number,
    limit: PurchaseLimitEntity,
  ): Promise<PurchaseLimitTrackingEntity | null> {
    const now = new Date();
    return await this.trackingRepo.findOne({
      where: {
        user_id: userId,
        listing_id: limit.listing_id,
        period_type: limit.period_type,
        period_start: LessThanOrEqual(now),
        period_end: MoreThan(now),
      },
    });
  }

  private sumQuantities(
    items: { listing_id: number; quantity: number }[],
  ): Map<number, number> {
    const quantities = new Map<number, number>();
    for (const item of items) {
      quantities.set(
        item.listing_id,
        (quantities.get(item.listing_id) ?? 0) + item.quantity,
      );
    }
    return quantities;
  }

  private getPeriodEnd(start: Date, periodType: string): Date {
    const end = new Date(start);
    if (periodType === 'weekly') {
      end.setDate(end.getDate() + 7);
    } else if (periodType === 'monthly') {
      end.setMonth(end.getMonth() + 1);
    } else {
      end.setDate(end.getDate() + 1);
    }
    return end;
  }
}
