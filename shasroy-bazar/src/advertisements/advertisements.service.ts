<<<<<<< HEAD

import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { randomUUID } from 'node:crypto';

import {
  Advertisement,
  AdvertisementStatus,
} from './entities/advertisement.entity.js';

import { AdvertisementReview } from './entities/advertisement-review.entity.js';

import { AdvertisingPaymentEntity } from './entities/advertising-payment.entity.js';

import { AdvertisingRevenueRecord } from '../advertising-revenue/entities/advertising-revenue-record.entity.js';

import { Organization } from '../organizations/entities/organization.entity.js';

import { CreateAdvertisementDto } from './dto/create-advertisement.dto.js';
import { UpdateAdvertisementDto } from './dto/update-advertisement.dto.js';
import { SimulateAdvertisingPaymentDto } from './dto/simulate-advertising-payment.dto.js';
=======
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Advertisement } from './entities/advertisement.entity.js';
import { Organization } from '../organizations/entities/organization.entity.js';
import { CreateAdvertisementDto } from './dto/create-advertisement.dto.js';
import { UpdateAdvertisementDto } from './dto/update-advertisement.dto.js';
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361

@Injectable()
export class AdvertisementsService {
  constructor(
    @InjectRepository(Advertisement)
    private readonly adRepo: Repository<Advertisement>,
<<<<<<< HEAD

    @InjectRepository(Organization)
    private readonly orgRepo: Repository<Organization>,

    @InjectRepository(AdvertisementReview)
    private readonly reviewRepo: Repository<AdvertisementReview>,

    private readonly dataSource: DataSource,
  ) {}

  // ORGANIZATION: CREATE ADVERTISEMENT DRAFT
  async createAdvertisement(
    ad: CreateAdvertisementDto,
    userId: number,
  ) {
    const org = await this.orgRepo.findOne({
      where: {
        user: {
          userId: userId,
        },
      },
    });

    if (!org) {
      throw new NotFoundException(
        'No organization is associated with this user',
      );
    }

    if (org.organization_status !== 'verified') {
      throw new ForbiddenException(
        'Your organization must be verified before submitting advertisements',
      );
    }

    const startDate = new Date(ad.start_date);
    const endDate = new Date(ad.end_date);

    if (endDate <= startDate) {
      throw new BadRequestException(
        'Advertisement end date must be later than start date',
      );
    }

    const newAd = this.adRepo.create({
      campaign_name: ad.campaign_name,
      content_url: ad.content_url,
      start_date: startDate,
      end_date: endDate,
      budget: ad.budget,
      organization: org,
      ad_status: AdvertisementStatus.PENDING_PAYMENT,
    });

    return await this.adRepo.save(newAd);
  }

  // ORGANIZATION: SIMULATE ADVERTISEMENT PAYMENT
  async simulateAdvertisingPayment(
    advertisementId: number,
    userId: number,
    dto: SimulateAdvertisingPaymentDto,
  ) {
    return await this.dataSource.transaction(async (manager) => {
      const advertisementRepository =
        manager.getRepository(Advertisement);

      const paymentRepository =
        manager.getRepository(AdvertisingPaymentEntity);

      const revenueRepository =
        manager.getRepository(AdvertisingRevenueRecord);

      // Check whether this payment request was already processed
      const previousPayment = await paymentRepository.findOne({
        where: {
          idempotency_ref: dto.idempotency_ref,
        },
        relations: {
          advertisement: {
            organization: {
              user: true,
            },
          },
        },
      });

      if (previousPayment) {
        const previousAd = previousPayment.advertisement;

        if (
          previousAd.ad_id !== advertisementId ||
          previousAd.organization.user.userId !== userId
        ) {
          throw new ConflictException(
            'This idempotency reference has already been used',
          );
        }

        return {
          message:
            previousPayment.payment_status === 'Success'
              ? 'Advertising payment successful'
              : 'Advertising payment failed. Use a new payment request to retry.',
          payment: previousPayment,
          advertisement_status: previousAd.ad_status,
        };
      }

      // Find and lock the advertisement
      const ad = await advertisementRepository.findOne({
        where: {
          ad_id: advertisementId,
          organization: {
            user: {
              userId: userId,
            },
          },
        },
        relations: {
          organization: {
            user: true,
          },
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (!ad) {
        throw new NotFoundException(
          'Advertisement not found or does not belong to you',
        );
      }

      if (ad.organization.organization_status !== 'verified') {
        throw new ForbiddenException(
          'Your organization must be verified before making advertising payments',
        );
      }

      if (ad.ad_status !== AdvertisementStatus.PENDING_PAYMENT) {
        throw new ConflictException(
          'Payment is allowed only for advertisements awaiting payment',
        );
      }

      // Prevent another successful payment for the same advertisement
      const existingSuccessfulPayment =
        await paymentRepository.findOne({
          where: {
            advertisement: {
              ad_id: advertisementId,
            },
            payment_status: 'Success',
          },
        });

      if (existingSuccessfulPayment) {
        throw new ConflictException(
          'This advertisement has already been paid',
        );
      }

      if (Number(ad.budget) <= 0) {
        throw new BadRequestException(
          'Invalid advertisement payment amount',
        );
      }

      // Generate simulated transaction reference
      const providerTxnId = `SIM-${randomUUID()}`;

      // Determine simulated payment result
      const paymentStatus =
        dto.simulation_result === 'success'
          ? 'Success'
          : 'Failed';

      // Create advertising payment record
      const payment = paymentRepository.create({
        advertisement: ad,
        amount: String(ad.budget),
        payment_method: dto.payment_method,
        payment_status: paymentStatus,
        provider_txn_id: providerTxnId,
        idempotency_ref: dto.idempotency_ref,
        confirmed_at:
          paymentStatus === 'Success' ? new Date() : null,
      });

      const savedPayment = await paymentRepository.save(payment);

      // Update advertisement and create revenue only on success
      if (paymentStatus === 'Success') {
        ad.ad_status = AdvertisementStatus.PENDING;

        await advertisementRepository.save(ad);

        // Create advertising revenue record
        const revenue = revenueRepository.create({
          amount: Number(savedPayment.amount),
          payment_ref: savedPayment.provider_txn_id,
          period_start: ad.start_date,
          period_end: ad.end_date,
          advertisement: ad,
        });

        await revenueRepository.save(revenue);
      }

      return {
        message:
          paymentStatus === 'Success'
            ? 'Advertising payment successful. Advertisement submitted for admin review.'
            : 'Advertising payment failed. You may try again.',
        payment: {
          payment_id: savedPayment.payment_id,
          advertisement_id: advertisementId,
          amount: savedPayment.amount,
          payment_method: savedPayment.payment_method,
          payment_status: savedPayment.payment_status,
          provider_txn_id: savedPayment.provider_txn_id,
          initiated_at: savedPayment.initiated_at,
          confirmed_at: savedPayment.confirmed_at,
        },
        advertisement_status: ad.ad_status,
      };
    });
  }

  // ADMIN: GET ALL ADVERTISEMENTS
  async getAllAdvertisements() {
    return await this.adRepo.find({
      relations: {
        organization: true,
        reviewedByAdmin: true,
=======
    @InjectRepository(Organization)
    private readonly orgRepo: Repository<Organization>,
  ) {}

  async createAdvertisement(ad: CreateAdvertisementDto)
  {
    const org = await this.orgRepo.findOne({
      where: {
        org_id: ad.org_id,
      },
    });
    if (!org) {
      throw new NotFoundException(`Organization with id ${ad.org_id} not found`);
    }
    try {
      const newAd = await this.adRepo.create({
        campaign_name: ad.campaign_name,
        content_url: ad.content_url,
        start_date: new Date(ad.start_date),
        end_date: new Date(ad.end_date),
        budget: ad.budget,
        organization: org,
      });
      return await this.adRepo.save(newAd);
    } catch {
      throw new BadRequestException('Advertisement creation failed');
    }
  }

  async getAllAdvertisements() {
    return await this.adRepo.find({
            relations: {
        organization: true,
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
      },
    });
  }

<<<<<<< HEAD
  // ADMIN: GET ADVERTISEMENT BY ID
  async getAdvertisementById(id: number) {
=======
  async getAdvertisementById(id: number){
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
    const ad = await this.adRepo.findOne({
      where: {
        ad_id: id,
      },
<<<<<<< HEAD
      relations: {
        organization: true,
        reviewedByAdmin: true,
      },
    });

    if (!ad) {
      throw new NotFoundException(
        `Advertisement with id ${id} not found`,
      );
    }

    return ad;
  }

  // ADMIN: UPDATE ADVERTISEMENT
=======
            relations: {
        organization: true,
      },
    });
    if (!ad) {
      throw new NotFoundException(`Advertisement with id ${id} not found`);
    }
    return ad;
  }

>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
  async updateAdvertisement(
    id: number,
    ad: UpdateAdvertisementDto,
  ) {
<<<<<<< HEAD
    return await this.dataSource.transaction(async (manager) => {
      const advertisementRepository =
        manager.getRepository(Advertisement);

      const oldAd = await advertisementRepository.findOne({
        where: {
          ad_id: id,
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (!oldAd) {
        throw new NotFoundException(
          `Advertisement with id ${id} not found`,
        );
      }

      if (oldAd.ad_status === AdvertisementStatus.REMOVED) {
        throw new BadRequestException(
          'Removed advertisements cannot be updated',
        );
      }

      // Budget and campaign dates cannot change after payment
      if (
        oldAd.ad_status !== AdvertisementStatus.PENDING_PAYMENT &&
        (
          ad.budget !== undefined ||
          ad.start_date !== undefined ||
          ad.end_date !== undefined
        )
      ) {
        throw new BadRequestException(
          'Budget and campaign dates cannot be changed after payment',
        );
      }

      if (ad.campaign_name !== undefined) {
        oldAd.campaign_name = ad.campaign_name;
      }

      if (ad.content_url !== undefined) {
        oldAd.content_url = ad.content_url;
      }

      if (ad.start_date !== undefined) {
        oldAd.start_date = new Date(ad.start_date);
      }

      if (ad.end_date !== undefined) {
        oldAd.end_date = new Date(ad.end_date);
      }

      if (ad.budget !== undefined) {
        oldAd.budget = ad.budget;
      }

      if (oldAd.end_date <= oldAd.start_date) {
        throw new BadRequestException(
          'Advertisement end date must be later than start date',
        );
      }

      await advertisementRepository.save(oldAd);

      return `Advertisement updated with id ${id}`;
    });
  }

  // COMMON: UPDATE STATUS AND SAVE REVIEW HISTORY
  private async reviewAdvertisement(
    id: number,
    adminId: number,
    status: AdvertisementStatus,
    reason: string,
    expectedStatus: AdvertisementStatus | null,
  ) {
    if (!reason || !reason.trim()) {
      throw new BadRequestException(
        'A review reason is required',
      );
    }

    return await this.dataSource.transaction(async (manager) => {
      const advertisementRepository =
        manager.getRepository(Advertisement);

      const reviewRepository =
        manager.getRepository(AdvertisementReview);

      // Lock advertisement before changing its review status
      const ad = await advertisementRepository.findOne({
        where: {
          ad_id: id,
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (!ad) {
        throw new NotFoundException(
          `Advertisement with id ${id} not found`,
        );
      }

      if (ad.ad_status === AdvertisementStatus.REMOVED) {
        throw new BadRequestException(
          'Removed advertisements cannot be reviewed',
        );
      }

      if (
        expectedStatus !== null &&
        ad.ad_status !== expectedStatus
      ) {
        throw new BadRequestException(
          `Only ${expectedStatus} advertisements can be changed to ${status}`,
        );
      }

      const previousStatus = ad.ad_status;

      ad.ad_status = status;
      ad.review_reason = reason.trim();
      ad.reviewed_at = new Date();
      ad.reviewedByAdmin = { adminId } as any;

      await advertisementRepository.save(ad);

      const review = reviewRepository.create({
        advertisement: ad,
        reviewedByAdmin: { adminId } as any,
        previous_status: previousStatus,
        new_status: status,
        reason: reason.trim(),
      });

      await reviewRepository.save(review);

      return `Advertisement ${status} with id ${id}`;
    });
  }

  // ADMIN: APPROVE ADVERTISEMENT
  async approveAdvertisement(
    id: number,
    adminId: number,
    reason: string,
  ) {
    return await this.reviewAdvertisement(
      id,
      adminId,
      AdvertisementStatus.APPROVED,
      reason,
      AdvertisementStatus.PENDING,
    );
  }

  // ADMIN: REJECT ADVERTISEMENT
  async rejectAdvertisement(
    id: number,
    adminId: number,
    reason: string,
  ) {
    return await this.reviewAdvertisement(
      id,
      adminId,
      AdvertisementStatus.REJECTED,
      reason,
      AdvertisementStatus.PENDING,
    );
  }

  // ADMIN: SUSPEND ADVERTISEMENT
  async suspendAdvertisement(
    id: number,
    adminId: number,
    reason: string,
  ) {
    return await this.reviewAdvertisement(
      id,
      adminId,
      AdvertisementStatus.SUSPENDED,
      reason,
      AdvertisementStatus.APPROVED,
    );
  }

  // ADMIN: REMOVE ADVERTISEMENT
  async removeAdvertisement(
    id: number,
    adminId: number,
    reason: string,
  ) {
    return await this.reviewAdvertisement(
      id,
      adminId,
      AdvertisementStatus.REMOVED,
      reason,
      null,
    );
  }

  // GET REVIEW HISTORY OF AN ADVERTISEMENT
  async getAdvertisementReviewHistory(id: number) {
    await this.getAdvertisementById(id);

    return await this.reviewRepo.find({
      where: {
        advertisement: {
          ad_id: id,
        },
      },
      relations: {
        reviewedByAdmin: true,
      },
      order: {
        reviewed_at: 'ASC',
      },
    });
=======
    const oldAd = await this.getAdvertisementById(id);

    if (ad.org_id) {
      const org = await this.orgRepo.findOne({
        where: {
          org_id: ad.org_id,
        },
      });
      if (!org) {
        throw new NotFoundException(`Organization with id ${ad.org_id} not found`);
      }
      oldAd.organization = org;
    }
    if (ad.campaign_name) oldAd.campaign_name = ad.campaign_name;
    if (ad.content_url) oldAd.content_url = ad.content_url;
    if (ad.start_date) oldAd.start_date = new Date(ad.start_date);
    if (ad.end_date) oldAd.end_date = new Date(ad.end_date);
    if (ad.budget != undefined) oldAd.budget = ad.budget;

    await this.adRepo.save(oldAd);
    return `Advertisement updated with id ${id}`;
  }

    async approveAdvertisement(id: number, adminId: number){
    const result = (
      await this.adRepo.update(id, {
        ad_status: 'approved',
        approvedByAdmin: { adminId: adminId },
      })
    ).affected;
    if (result != undefined && result > 0) {
      return `Advertisement approved with id ${id}`;
    } else {
      throw new NotFoundException(`Advertisement with id ${id} not found`);
    }
  }

  async deleteAdvertisement(id: number) {
    const result = (await this.adRepo.delete(id)).affected;
    if (result != null && result > 0) {
      return `Advertisement deleted with id ${id}`;
    } else {
      throw new NotFoundException(`Advertisement with id ${id} not found`);
    }
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
  }
}
