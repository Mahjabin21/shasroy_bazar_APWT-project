
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AdvertisingRevenueRecord } from './entities/advertising-revenue-record.entity.js';

@Injectable()
export class AdvertisingRevenueService {
  constructor(
    @InjectRepository(AdvertisingRevenueRecord)
    private readonly revenueRepo: Repository<AdvertisingRevenueRecord>,
  ) {}

  // ADMIN: GET ALL REVENUE RECORDS
  async getAllRevenues(): Promise<AdvertisingRevenueRecord[]> {
    return await this.revenueRepo.find({
      relations: {
        advertisement: true,
      },
      order: {
        recorded_at: 'DESC',
      },
    });
  }

  // ADMIN: GET REVENUE RECORD BY ID
  async getRevenueById(
    id: number,
  ): Promise<AdvertisingRevenueRecord> {
    const revenue = await this.revenueRepo.findOne({
      where: {
        revenue_id: id,
      },
      relations: {
        advertisement: true,
      },
    });

    if (!revenue) {
      throw new NotFoundException(
        `Revenue record with id ${id} not found`,
      );
    }

    return revenue;
  }
}
