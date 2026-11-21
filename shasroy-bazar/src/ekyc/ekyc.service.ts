
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EkycVerification } from './entities/ekyc-verification.entity.js';
import { User } from '../users/entities/user.entity.js';
import { SubmitEkycDto } from './dto/submit-ekyc.dto.js';

@Injectable()
export class EkycService {
  constructor(
    @InjectRepository(EkycVerification)
    private readonly ekycRepository: Repository<EkycVerification>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Submit eKYC information
  async submitEkyc(
    userId: number,
    submitEkycDto: SubmitEkycDto,
  ) {
    const user = await this.userRepository.findOne({
      where: { userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check whether this user already submitted eKYC
    const existingEkyc = await this.ekycRepository.findOne({
      where: {
        user: { userId },
      },
    });

    if (existingEkyc) {
      throw new ConflictException(
        'eKYC has already been submitted for this user',
      );
    }

    // Check for duplicate NID
    const duplicateNid = await this.ekycRepository.findOne({
      where: {
        nidNumber: submitEkycDto.nidNumber,
      },
    });

    if (duplicateNid) {
      throw new ConflictException(
        'This NID is already associated with another account',
      );
    }

    const ekyc = this.ekycRepository.create({
      nidNumber: submitEkycDto.nidNumber,
      nidFrontUrl: submitEkycDto.nidFrontUrl,
      nidBackUrl: submitEkycDto.nidBackUrl,
      selfieUrl: submitEkycDto.selfieUrl,
      consentTimestamp: new Date(),
      verificationStatus: 'pending',
      user,
    });

    await this.ekycRepository.save(ekyc);

    // Update the user's eKYC status
    user.ekycStatus = 'pending';
    await this.userRepository.save(user);

    return {
      message: 'eKYC submitted successfully and is pending verification',
      ekycStatus: ekyc.verificationStatus,
    };
  }

  // Get eKYC verification status
  async getVerificationStatus(userId: number) {
    const ekyc = await this.ekycRepository.findOne({
      where: {
        user: { userId },
      },
    });

    if (!ekyc) {
      throw new NotFoundException(
        'No eKYC submission found for this user',
      );
    }

    return {
      userId,
      verificationStatus: ekyc.verificationStatus,
    };
  }
}
