import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Merchant } from './entities/merchant.entity.js';
import { User } from '../users/entities/user.entity.js';
import { CreateMerchantDto } from './dto/create-merchant.dto.js';

@Injectable()
export class MerchantsService {
  constructor(
    @InjectRepository(Merchant)
    private readonly merchantRepository: Repository<Merchant>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Register a new Merchant
  async register(
    userId: number,
    createMerchantDto: CreateMerchantDto,
  ) {
    // Find the existing User
    const user = await this.userRepository.findOne({
      where: { userId },
    });

    if (!user) {
      throw new NotFoundException('User account not found');
    }

    // Check whether this User already has a Merchant profile
    const existingMerchant = await this.merchantRepository.findOne({
      where: {
        user: {
          userId: userId,
        },
      },
    });

    if (existingMerchant) {
      throw new ConflictException(
        'Merchant registration already exists',
      );
    }

    // Create Merchant profile
    const merchant = this.merchantRepository.create({
      businessName: createMerchantDto.businessName,
      businessCategory: createMerchantDto.businessCategory,
      contactPerson: createMerchantDto.contactPerson,
      contactPhone: createMerchantDto.contactPhone,
      tradeLicenseRef: createMerchantDto.tradeLicenseRef,
      status: 'pending',
      user: user,
    });

    // Save Merchant in database
    const savedMerchant = await this.merchantRepository.save(merchant);

    return {
      message: 'Merchant registration submitted successfully',
      merchant: {
        merchantId: savedMerchant.merchantId,
        businessName: savedMerchant.businessName,
        businessCategory: savedMerchant.businessCategory,
        status: savedMerchant.status,
      },
    };
  }

  
  // Get Merchant Profile
  async getProfile(userId: number) {

    const merchant = await this.merchantRepository.findOne({
      where: {
        user: {
          userId: userId,
        },
      },
    });

    if (!merchant) {
      throw new NotFoundException(
        'Merchant profile not found',
      );
    }

    return {
      message: 'Merchant profile retrieved successfully',
      merchant: {
        merchantId: merchant.merchantId,
        businessName: merchant.businessName,
        businessCategory: merchant.businessCategory,
        contactPerson: merchant.contactPerson,
        contactPhone: merchant.contactPhone,
        tradeLicenseRef: merchant.tradeLicenseRef,
        status: merchant.status,
        reviewReason: merchant.reviewReason,
        reviewedAt: merchant.reviewedAt,
      },
    };
  }

  
}
