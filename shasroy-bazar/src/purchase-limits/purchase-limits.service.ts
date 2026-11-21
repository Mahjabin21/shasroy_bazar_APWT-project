
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
<<<<<<< HEAD

import { InjectRepository } from '@nestjs/typeorm';
import {
  LessThanOrEqual,
  MoreThan,
  Repository,
} from 'typeorm';

=======
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThan, Repository } from 'typeorm';
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
import { PurchaseLimitEntity } from './entities/purchase-limit.entity.js';
import { PurchaseLimitTrackingEntity } from './entities/purchase-limit-tracking.entity.js';
import { SetPurchaseLimitDto } from './dto/set-purchase-limit.dto.js';

<<<<<<< HEAD
import { ProductBundle } from '../bundles/entities/product-bundle.entity.js';
import { BundleItem } from '../bundles/entities/bundle-item.entity.js';

=======
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
@Injectable()
export class PurchaseLimitsService {
  constructor(
    @InjectRepository(PurchaseLimitEntity)
    private readonly limitRepo: Repository<PurchaseLimitEntity>,
<<<<<<< HEAD

    @InjectRepository(PurchaseLimitTrackingEntity)
    private readonly trackingRepo: Repository<PurchaseLimitTrackingEntity>,

    @InjectRepository(ProductBundle)
    private readonly bundleRepo: Repository<ProductBundle>,

    @InjectRepository(BundleItem)
    private readonly bundleItemRepo: Repository<BundleItem>,
=======
    @InjectRepository(PurchaseLimitTrackingEntity)
    private readonly trackingRepo: Repository<PurchaseLimitTrackingEntity>,
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
  ) {}

  isValidTrackingPeriod(
    periodStart: Date,
    periodEnd: Date,
  ): boolean {
<<<<<<< HEAD
=======

>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
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

<<<<<<< HEAD
  async setLimit(
    dto: SetPurchaseLimitDto,
  ): Promise<PurchaseLimitEntity> {
=======
  async setLimit(dto: SetPurchaseLimitDto): Promise<PurchaseLimitEntity> {
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
    const existing = await this.limitRepo.findOne({
      where: { listing_id: dto.listing_id },
    });

    if (existing) {
      existing.max_quantity = dto.max_quantity;
<<<<<<< HEAD
      existing.period_type =
        dto.period_type ?? existing.period_type;

=======
      existing.period_type = dto.period_type ?? existing.period_type;
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
      return await this.limitRepo.save(existing);
    }

    const newLimit = this.limitRepo.create({
      listing_id: dto.listing_id,
      max_quantity: dto.max_quantity,
      period_type: dto.period_type ?? 'daily',
    });
<<<<<<< HEAD

=======
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
    return await this.limitRepo.save(newLimit);
  }

  async getAllLimits(): Promise<PurchaseLimitEntity[]> {
    return await this.limitRepo.find();
  }

<<<<<<< HEAD
  async getLimitByListing(
    listingId: number,
  ): Promise<PurchaseLimitEntity> {
    const limit = await this.limitRepo.findOne({
      where: { listing_id: listingId },
    });

=======
  async getLimitByListing(listingId: number): Promise<PurchaseLimitEntity> {
    const limit = await this.limitRepo.findOne({
      where: { listing_id: listingId },
    });
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
    if (!limit) {
      throw new NotFoundException(
        `Purchase limit for listing ${listingId} not found`,
      );
    }
<<<<<<< HEAD

=======
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
    return limit;
  }

  async deleteLimit(id: number): Promise<string> {
    const result = (await this.limitRepo.delete(id)).affected;
<<<<<<< HEAD

    if (result != null && result > 0) {
      return `Purchase limit deleted with id ${id}`;
    }

    throw new NotFoundException(
      `Purchase limit with id ${id} not found`,
    );
=======
    if (result != null && result > 0) {
      return `Purchase limit deleted with id ${id}`;
    } else {
      throw new NotFoundException(`Purchase limit with id ${id} not found`);
    }
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
  }

  async getUserTracking(
    userId: number,
  ): Promise<PurchaseLimitTrackingEntity[]> {
    return await this.trackingRepo.find({
      where: { user_id: userId },
      order: { period_start: 'DESC' },
    });
  }

<<<<<<< HEAD
  // Expand direct products and bundles into product quantities.
  async calculateProductQuantities(
    items: {
      listing_id?: number;
      bundle_id?: number;
      quantity: number;
    }[],
  ): Promise<Map<number, number>> {
    const quantities = new Map<number, number>();

    for (const item of items) {
      if (
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0
      ) {
        throw new BadRequestException(
          'Order quantity must be a positive whole number.',
        );
      }

      if (item.listing_id !== undefined) {
        this.addQuantity(
          quantities,
          item.listing_id,
          item.quantity,
        );

        continue;
      }

      if (item.bundle_id !== undefined) {
        const bundle = await this.bundleRepo.findOne({
          where: { bundleId: item.bundle_id },
        });

        if (!bundle) {
          throw new NotFoundException(
            `Bundle ${item.bundle_id} not found.`,
          );
        }

        const bundleItems = await this.bundleItemRepo.find({
          where: { bundleId: item.bundle_id },
        });

        if (bundleItems.length === 0) {
          throw new BadRequestException(
            `Bundle ${item.bundle_id} contains no products.`,
          );
        }

        for (const bundleItem of bundleItems) {
          const componentQuantity = Number(
            bundleItem.quantity,
          );

          if (
            !Number.isInteger(componentQuantity) ||
            componentQuantity <= 0
          ) {
            throw new BadRequestException(
              `Invalid component quantity in bundle ${item.bundle_id}.`,
            );
          }

          this.addQuantity(
            quantities,
            bundleItem.listingId,
            componentQuantity * item.quantity,
          );
        }

        continue;
      }

      throw new BadRequestException(
        'Each order item must contain a listing_id or bundle_id.',
      );
    }

    return quantities;
  }

  async checkPurchaseLimits(
    userId: number,
    items: {
      listing_id?: number;
      bundle_id?: number;
      quantity: number;
    }[],
  ): Promise<void> {
    const quantities =
      await this.calculateProductQuantities(items);
=======
  async checkPurchaseLimits(
    userId: number,
    items: { listing_id: number; quantity: number }[],
  ): Promise<void> {
    const quantities = this.sumQuantities(items);
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361

    for (const [listingId, quantity] of quantities) {
      const limit = await this.limitRepo.findOne({
        where: { listing_id: listingId },
      });
<<<<<<< HEAD

=======
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
      if (!limit) {
        continue;
      }

<<<<<<< HEAD
      const tracking = await this.findActiveTracking(
        userId,
        limit,
      );

      const alreadyBought = tracking
        ? tracking.purchase_count
        : 0;
=======
      const tracking = await this.findActiveTracking(userId, limit);
      const alreadyBought = tracking ? tracking.purchase_count : 0;
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361

      if (alreadyBought + quantity > limit.max_quantity) {
        throw new BadRequestException(
          `Purchase limit exceeded for listing ${listingId}. ` +
<<<<<<< HEAD
          `Limit is ${limit.max_quantity} per ${limit.period_type} period, ` +
          `already purchased ${alreadyBought}, requested ${quantity}`,
=======
            `Limit is ${limit.max_quantity} per ${limit.period_type} period, ` +
            `already purchased ${alreadyBought}, requested ${quantity}`,
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
        );
      }
    }
  }

  async recordPurchases(
    userId: number,
<<<<<<< HEAD
    items: {
      listing_id?: number;
      bundle_id?: number;
      quantity: number;
    }[],
  ): Promise<void> {
    const quantities =
      await this.calculateProductQuantities(items);
=======
    items: { listing_id: number; quantity: number }[],
  ): Promise<void> {
    const quantities = this.sumQuantities(items);
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361

    for (const [listingId, quantity] of quantities) {
      const limit = await this.limitRepo.findOne({
        where: { listing_id: listingId },
      });
<<<<<<< HEAD

=======
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
      if (!limit) {
        continue;
      }

<<<<<<< HEAD
      const tracking = await this.findActiveTracking(
        userId,
        limit,
      );

=======
      const tracking = await this.findActiveTracking(userId, limit);
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
      if (tracking) {
        tracking.purchase_count += quantity;
        await this.trackingRepo.save(tracking);
        continue;
      }

      const periodStart = new Date();
<<<<<<< HEAD
      const periodEnd = this.getPeriodEnd(
        periodStart,
        limit.period_type,
      );

      if (
        !this.isValidTrackingPeriod(
          periodStart,
          periodEnd,
        )
      ) {
        throw new BadRequestException(
          'Invalid purchase limit period',
        );
=======
      const periodEnd = this.getPeriodEnd(periodStart, limit.period_type);
      if (!this.isValidTrackingPeriod(periodStart, periodEnd)) {
        throw new BadRequestException('Invalid purchase limit period');
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
      }

      const newTracking = this.trackingRepo.create({
        user_id: userId,
        listing_id: listingId,
        period_type: limit.period_type,
        purchase_count: quantity,
        period_start: periodStart,
        period_end: periodEnd,
      });
<<<<<<< HEAD

=======
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
      await this.trackingRepo.save(newTracking);
    }
  }

<<<<<<< HEAD
  private addQuantity(
    quantities: Map<number, number>,
    listingId: number,
    quantity: number,
  ): void {
    quantities.set(
      listingId,
      (quantities.get(listingId) ?? 0) + quantity,
    );
  }

=======
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
  private async findActiveTracking(
    userId: number,
    limit: PurchaseLimitEntity,
  ): Promise<PurchaseLimitTrackingEntity | null> {
    const now = new Date();
<<<<<<< HEAD

=======
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
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

<<<<<<< HEAD
  private getPeriodEnd(
    start: Date,
    periodType: string,
  ): Date {
    const end = new Date(start);

=======
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
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
    if (periodType === 'weekly') {
      end.setDate(end.getDate() + 7);
    } else if (periodType === 'monthly') {
      end.setMonth(end.getMonth() + 1);
    } else {
      end.setDate(end.getDate() + 1);
    }
<<<<<<< HEAD

=======
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
    return end;
  }
}
