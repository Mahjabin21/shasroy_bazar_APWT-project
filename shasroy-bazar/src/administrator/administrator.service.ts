import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Administrator } from './entities/administrator.entity.js';
import { Merchant } from '../merchants/entities/merchant.entity.js';
import { EkycVerification } from '../ekyc/entities/ekyc-verification.entity.js';
import { User } from '../users/entities/user.entity.js';
import { RejectMerchantDto } from './dto/reject-merchant.dto.js';
import { UpdateEkycStatusDto } from './dto/update-ekyc-status.dto.js';
import { VerificationStatus } from '../common/enum/verification-status.enum.js';

@Injectable()
export class AdministratorService {
  constructor(
    @InjectRepository(Administrator)
    private readonly administratorRepository: Repository<Administrator>,

    @InjectRepository(Merchant)
    private readonly merchantRepository: Repository<Merchant>,

    @InjectRepository(EkycVerification)
    private readonly ekycRepository: Repository<EkycVerification>,
  ) {}

  // GET PENDING MERCHANT APPLICATIONS
  async getPendingMerchants() {
    const merchants = await this.merchantRepository.find({
      where: {
        status: 'pending',
      },
      relations: {
        user: true,
      },
    });

    return {
      message: 'Pending merchant applications retrieved successfully',
      total: merchants.length,
      merchants: merchants.map((merchant) => ({
        merchantId: merchant.merchantId,
        businessName: merchant.businessName,
        businessCategory: merchant.businessCategory,
        contactPerson: merchant.contactPerson,
        contactPhone: merchant.contactPhone,
        tradeLicenseRef: merchant.tradeLicenseRef,
        status: merchant.status,
        userId: merchant.user.userId,
      })),
    };
  }

  // APPROVE MERCHANT APPLICATION
  async approveMerchant(merchantId: number, adminId: number) {
    // Find merchant application
    const merchant = await this.merchantRepository.findOne({
      where: { merchantId },
    });

    if (!merchant) {
      throw new NotFoundException('Merchant application not found');
    }

    // Only pending applications can be approved
    if (merchant.status !== 'pending') {
      throw new ConflictException(
        `Merchant application is already ${merchant.status}`,
      );
    }

    // Find the administrator who is approving
    const administrator = await this.administratorRepository.findOne({
      where: { adminId },
    });

    if (!administrator) {
      throw new NotFoundException('Administrator not found');
    }

    // Update merchant application
    merchant.status = 'approved';
    merchant.reviewedByAdmin = administrator;
    merchant.reviewedAt = new Date();
    merchant.reviewReason = null;

    const updatedMerchant = await this.merchantRepository.save(merchant);

    return {
      message: 'Merchant approved successfully',
      merchant: {
        merchantId: updatedMerchant.merchantId,
        businessName: updatedMerchant.businessName,
        status: updatedMerchant.status,
        reviewedAt: updatedMerchant.reviewedAt,
      },
    };
  }

  // REJECT MERCHANT APPLICATION
  async rejectMerchant(
    merchantId: number,
    adminId: number,
    rejectMerchantDto: RejectMerchantDto,
  ) {
    // Find merchant application
    const merchant = await this.merchantRepository.findOne({
      where: { merchantId },
    });

    if (!merchant) {
      throw new NotFoundException('Merchant application not found');
    }

    // Only pending applications can be rejected
    if (merchant.status !== 'pending') {
      throw new ConflictException(
        `Merchant application is already ${merchant.status}`,
      );
    }

    // Find administrator
    const administrator = await this.administratorRepository.findOne({
      where: { adminId },
    });

    if (!administrator) {
      throw new NotFoundException('Administrator not found');
    }

    // Update merchant application
    merchant.status = 'rejected';
    merchant.reviewReason = rejectMerchantDto.reason;
    merchant.reviewedByAdmin = administrator;
    merchant.reviewedAt = new Date();

    const updatedMerchant = await this.merchantRepository.save(merchant);

    return {
      message: 'Merchant application rejected successfully',
      merchant: {
        merchantId: updatedMerchant.merchantId,
        businessName: updatedMerchant.businessName,
        status: updatedMerchant.status,
        reviewReason: updatedMerchant.reviewReason,
        reviewedAt: updatedMerchant.reviewedAt,
      },
    };
  }

  async getAllMerchants() {
    const merchants = await this.merchantRepository.find({
      relations: {
        user: true,
        reviewedByAdmin: true,
      },
      order: {
        merchantId: 'DESC',
      },
    });

    return {
      message: 'All merchant applications retrieved successfully',
      total: merchants.length,
      merchants: merchants.map((merchant) => ({
        merchantId: merchant.merchantId,
        businessName: merchant.businessName,
        businessCategory: merchant.businessCategory,
        contactPerson: merchant.contactPerson,
        contactPhone: merchant.contactPhone,
        status: merchant.status,
        reviewReason: merchant.reviewReason,
        reviewedAt: merchant.reviewedAt,
        reviewedBy: merchant.reviewedByAdmin
          ? merchant.reviewedByAdmin.fullName
          : null,
        userId: merchant.user.userId,
      })),
    };
  }

 
  //.... eKYC VERIFICATION (administrator review)
 

  // GET PENDING eKYC APPLICATIONS (no NID number in the list)
  async getPendingEkyc() {
    const records = await this.ekycRepository.find({
      where: { verificationStatus: VerificationStatus.Pending },
      relations: { user: true },
      order: { ekycId: 'ASC' },
    });

    return {
      message: 'Pending eKYC applications retrieved successfully',
      total: records.length,
      applications: records.map((record) => ({
        ekycId: record.ekycId,
        userId: record.user.userId,
        fullName: record.user.fullName,
        mobileNumber: record.user.mobileNumber,
        verificationStatus: record.verificationStatus,
        submittedAt: record.consentTimestamp,
      })),
    };
  }

  // VIEW ONE eKYC APPLICATION (the administrator needs the NID to review it)
  async getEkycById(ekycId: number) {
    const record = await this.ekycRepository.findOne({
      where: { ekycId },
      relations: { user: true },
    });

    if (!record) {
      throw new NotFoundException('eKYC application not found');
    }

    return {
      message: 'eKYC application retrieved successfully',
      application: {
        ekycId: record.ekycId,
        userId: record.user.userId,
        fullName: record.user.fullName,
        mobileNumber: record.user.mobileNumber,
        dateOfBirth: record.user.dateOfBirth,
        nidNumber: record.nidNumber,
        nidFrontUrl: record.nidFrontUrl,
        nidBackUrl: record.nidBackUrl,
        selfieUrl: record.selfieUrl,
        verificationStatus: record.verificationStatus,
        submittedAt: record.consentTimestamp,
        decisionTimestamp: record.decisionTimestamp,
      },
    };
  }

  // APPROVE OR REJECT AN eKYC APPLICATION
  async updateEkycStatus(ekycId: number, dto: UpdateEkycStatusDto) {
    const record = await this.ekycRepository.findOne({
      where: { ekycId },
      relations: { user: true },
    });

    if (!record) {
      throw new NotFoundException('eKYC application not found');
    }

    // Only pending applications can be decided
    if (record.verificationStatus !== VerificationStatus.Pending) {
      throw new ConflictException(
        `eKYC application is already ${record.verificationStatus}`,
      );
    }

    const decisionTimestamp = new Date();

    // Update both tables together: either both succeed or neither does
    await this.ekycRepository.manager.transaction(async (manager) => {
      await manager.update(
        EkycVerification,
        { ekycId },
        {
          verificationStatus: dto.status,
          decisionTimestamp,
        },
      );

      await manager.update(
        User,
        { userId: record.user.userId },
        { ekycStatus: dto.status },
      );
    });

    return {
      message: `eKYC application ${dto.status} successfully`,
      application: {
        ekycId,
        userId: record.user.userId,
        verificationStatus: dto.status,
        decisionTimestamp,
      },
    };
  }
}