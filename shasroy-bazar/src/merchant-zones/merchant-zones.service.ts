
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MerchantZone } from './entities/merchant-zone.entity.js';
import { Merchant } from '../merchants/entities/merchant.entity.js';
import { ServiceZone } from '../service-zones/entities/service-zone.entity.js';

import { AssignMerchantZoneDto } from './dto/assign-merchant-zone.dto.js';

@Injectable()
export class MerchantZonesService {
  constructor(
    @InjectRepository(MerchantZone)
    private readonly merchantZoneRepository: Repository<MerchantZone>,

    @InjectRepository(Merchant)
    private readonly merchantRepository: Repository<Merchant>,

    @InjectRepository(ServiceZone)
    private readonly zoneRepository: Repository<ServiceZone>,
  ) {}

  // 1. Assign a service zone to a merchant
  async assignZone(dto: AssignMerchantZoneDto) {

    // Check whether merchant exists
    const merchant = await this.merchantRepository.findOne({
      where: { merchantId: dto.merchantId },
    });

    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    // Only approved merchants can receive zone assignments
    if (merchant.status !== 'approved') {
      throw new BadRequestException(
        'Only approved merchants can be assigned to a service zone',
      );
    }

    // Check whether service zone exists
    const zone = await this.zoneRepository.findOne({
      where: { zoneId: dto.zoneId },
    });

    if (!zone) {
      throw new NotFoundException('Service zone not found');
    }

    // Inactive zones cannot be assigned
    if (zone.zoneStatus !== 'active') {
      throw new BadRequestException(
        'Cannot assign an inactive service zone',
      );
    }

    // Check whether this assignment already exists
    const existingAssignment = await this.merchantZoneRepository.findOne({
      where: {
        merchantId: dto.merchantId,
        zoneId: dto.zoneId,
      },
    });

    if (existingAssignment) {
      throw new ConflictException(
        'Merchant is already assigned to this service zone',
      );
    }

    // Create and save the association
    const assignment = this.merchantZoneRepository.create({
      merchantId: merchant.merchantId,
      zoneId: zone.zoneId,
      merchant: merchant,
      zone: zone,
    });

    const savedAssignment =
      await this.merchantZoneRepository.save(assignment);

    return {
      message: 'Merchant assigned to service zone successfully',
      assignment: {
        merchantId: savedAssignment.merchantId,
        zoneId: savedAssignment.zoneId,
        merchantName: merchant.businessName,
        zoneName: zone.zoneName,
      },
    };
  }

  // 2. Get all zones assigned to a merchant
async getMerchantZones(merchantId: number) {

  const merchant = await this.merchantRepository.findOne({
    where: { merchantId },
  });

  if (!merchant) {
    throw new NotFoundException('Merchant not found');
  }

  const assignments = await this.merchantZoneRepository.find({
    where: { merchantId },
    relations: {
      zone: true,
    },
  });

  return {
    message: 'Merchant zones retrieved successfully',
    merchantId: merchant.merchantId,
    businessName: merchant.businessName,
    totalZones: assignments.length,
    zones: assignments.map((assignment) => ({
      zoneId: assignment.zone.zoneId,
      zoneName: assignment.zone.zoneName,
      zoneStatus: assignment.zone.zoneStatus,
    })),
  };
}

// 3. Remove a merchant from a service zone
async removeZone(merchantId: number, zoneId: number) {

  const assignment = await this.merchantZoneRepository.findOne({
    where: {
      merchantId,
      zoneId,
    },
  });

  if (!assignment) {
    throw new NotFoundException(
      'Merchant is not assigned to this service zone',
    );
  }

  await this.merchantZoneRepository.remove(assignment);

  return {
    message: 'Merchant removed from service zone successfully',
    merchantId,
    zoneId,
  };
}
}
