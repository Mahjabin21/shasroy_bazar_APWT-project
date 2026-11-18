
import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';

import {
  Product,
  ProductListingStatus,
} from '../products/entities/product.entity.js';

import { ExpiryRemovalRecord } from './entities/expiry-removal-record.entity.js';
import { ExpirySetting } from './entities/expiry-setting.entity.js';
import { Notification } from '../notification/entities/notification.entity.js';

import { UpdateExpiryThresholdDto } from './dto/update-expiry-threshold.dto.js';

@Injectable()
export class ExpiryService {
  private readonly logger = new Logger(ExpiryService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ExpiryRemovalRecord)
    private readonly removalRepository: Repository<ExpiryRemovalRecord>,

    @InjectRepository(ExpirySetting)
    private readonly settingRepository: Repository<ExpirySetting>,

    private readonly dataSource: DataSource,
  ) {}

  // GET OR CREATE THE GLOBAL EXPIRY SETTING
  async getExpirySetting() {
    let setting = await this.settingRepository.findOne({
      where: { settingId: 1 },
    });

    if (!setting) {
      setting = this.settingRepository.create({
        settingId: 1,
        thresholdDays: 7,
      });

      setting = await this.settingRepository.save(setting);
    }

    return setting;
  }

  // UPDATE THE EXPIRY THRESHOLD
  async updateExpiryThreshold(dto: UpdateExpiryThresholdDto) {
    if (
      !Number.isInteger(dto.thresholdDays) ||
      dto.thresholdDays < 1 ||
      dto.thresholdDays > 365
    ) {
      throw new BadRequestException(
        'Threshold must be an integer between 1 and 365 days.',
      );
    }

    const setting = await this.getExpirySetting();
    setting.thresholdDays = dto.thresholdDays;

    return this.settingRepository.save(setting);
  }

  // CALCULATE DAYS REMAINING FROM A DATE-ONLY VALUE
  private calculateDaysRemaining(expiryDate: string): number {
    const today = new Date();

    const todayUtc = Date.UTC(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    const expiry = new Date(`${expiryDate.slice(0, 10)}T00:00:00Z`);

    const expiryUtc = Date.UTC(
      expiry.getUTCFullYear(),
      expiry.getUTCMonth(),
      expiry.getUTCDate(),
    );

    return Math.ceil(
      (expiryUtc - todayUtc) / (1000 * 60 * 60 * 24),
    );
  }

  // CHECK ALL ACTIVE PRODUCT LISTINGS
  async checkExpiringProducts() {
    const setting = await this.getExpirySetting();
    const thresholdDays = setting.thresholdDays;

    const activeProducts = await this.productRepository.find({
      where: {
        listingStatus: ProductListingStatus.ACTIVE,
      },
    });

    let removedCount = 0;

    for (const product of activeProducts) {
      const daysRemaining = this.calculateDaysRemaining(
        product.expiryDate,
      );

      if (daysRemaining <= thresholdDays) {
        const removed = await this.removeExpiredListing(
          product.listingId,
          thresholdDays,
        );

        if (removed) {
          removedCount++;
        }
      }
    }

    this.logger.log(
      `Expiry check completed. Removed ${removedCount} product listing(s).`,
    );

    return {
      checkedCount: activeProducts.length,
      removedCount,
      thresholdDays,
    };
  }

  // REMOVE ONE LISTING AND SAVE ITS AUDIT RECORD AND NOTIFICATION
  private async removeExpiredListing(
    listingId: number,
    thresholdDays: number,
  ): Promise<boolean> {
    return this.dataSource.transaction(async (manager) => {
      const productRepository = manager.getRepository(Product);
      const removalRepository = manager.getRepository(ExpiryRemovalRecord);
      const notificationRepository = manager.getRepository(Notification);

      const product = await productRepository.findOne({
        where: { listingId },
        lock: { mode: 'pessimistic_write' },
      });

      if (
        !product ||
        product.listingStatus !== ProductListingStatus.ACTIVE
      ) {
        return false;
      }

      // Recheck the date in case it changed after the initial scan.
      const daysRemaining = this.calculateDaysRemaining(
        product.expiryDate,
      );

      if (daysRemaining > thresholdDays) {
        return false;
      }

      // Soft-remove the listing.
      product.listingStatus = ProductListingStatus.REMOVED;
      await productRepository.save(product);

      const existingRecord = await removalRepository.findOne({
        where: {
          product: { listingId: product.listingId },
        },
      });

      if (!existingRecord) {
        const record = removalRepository.create({
          product,
          recordedExpiryDate: product.expiryDate,
          thresholdDays,
        });

        await removalRepository.save(record);

        // Notify the merchant about the removed listing.
        const notification = notificationRepository.create({
          type: 'PRODUCT_EXPIRY',
          merchantId: product.merchantId,
          product,
          title: 'Product listing removed',
          message:
            `Your product "${product.productName}" was removed because ` +
            `its expiry date reached the ${thresholdDays}-day removal threshold. ` +
            `Recorded expiry date: ${product.expiryDate}.`,
          isRead: false,
        });

        await notificationRepository.save(notification);
      }

      return true;
    });
  }

  // AUTOMATIC CHECK EVERY DAY AT MIDNIGHT
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyExpiryCheck() {
    this.logger.log('Starting scheduled expiry check...');
    await this.checkExpiringProducts();
  }

  // GET EXPIRY REMOVAL HISTORY
  async findAllRemovalRecords() {
    return this.removalRepository.find({
      order: {
        removalTimestamp: 'DESC',
      },
    });
  }

  // GET REMOVAL RECORDS FOR ONE LISTING
  async findRemovalRecord(listingId: number) {
    const record = await this.removalRepository.findOne({
      where: {
        product: { listingId },
      },
      relations: {
        product: true,
      },
    });

    if (!record) {
      throw new NotFoundException(
        'No expiry removal record found for this listing.',
      );
    }

    return record;
  }
}
