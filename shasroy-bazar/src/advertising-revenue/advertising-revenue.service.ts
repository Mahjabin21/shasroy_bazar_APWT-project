import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdvertisingRevenueRecord } from './entities/advertising-revenue-record.entity.js';
import { Advertisement } from '../advertisements/entities/advertisement.entity.js';
import { CreateAdvertisingRevenueDto } from './dto/create-advertising-revenue.dto.js';
import { UpdateAdvertisingRevenueDto } from './dto/update-advertising-revenue.dto.js';

@Injectable()
export class AdvertisingRevenueService {
  constructor(
    @InjectRepository(AdvertisingRevenueRecord)
    private readonly revenueRepo: Repository<AdvertisingRevenueRecord>,
    @InjectRepository(Advertisement)
    private readonly adRepo: Repository<Advertisement>,
  ) {}

  async createRevenue(
    revenue: CreateAdvertisingRevenueDto,
  ): Promise<AdvertisingRevenueRecord> {
    const ad = await this.adRepo.findOne({
      where: {
        ad_id: revenue.ad_id,
      },
    });
    if (!ad) {
      throw new NotFoundException(`Advertisement with id ${revenue.ad_id} not found`);
    }
    try {
      const newRevenue = await this.revenueRepo.create({
        amount: revenue.amount,
        payment_ref: revenue.payment_ref,
        period_start: new Date(revenue.period_start),
        period_end: new Date(revenue.period_end),
        advertisement: ad,
      });
      return await this.revenueRepo.save(newRevenue);
    } catch {
      throw new BadRequestException('Revenue record creation failed');
    }
  }

  async getAllRevenues(): Promise<AdvertisingRevenueRecord[]> {
    return await this.revenueRepo.find({
      relations: {
        advertisement: true,
      },
    });
  }

  async getRevenueById(id: number): Promise<AdvertisingRevenueRecord> {
    const revenue = await this.revenueRepo.findOne({
      where: {
        revenue_id: id,
      },
      relations: {
        advertisement: true,
      },
    });
    if (!revenue) {
      throw new NotFoundException(`Revenue record with id ${id} not found`);
    }
    return revenue;
  }

  async updateRevenue(
    id: number,
    revenue: UpdateAdvertisingRevenueDto,
  ): Promise<string> {
    const oldRevenue = await this.getRevenueById(id);

    if (revenue.ad_id) {
      const ad = await this.adRepo.findOne({
        where: {
          ad_id: revenue.ad_id,
        },
      });
      if (!ad) {
        throw new NotFoundException(`Advertisement with id ${revenue.ad_id} not found`);
      }
      oldRevenue.advertisement = ad;
    }
    if (revenue.amount != undefined) oldRevenue.amount = revenue.amount;
    if (revenue.payment_ref) oldRevenue.payment_ref = revenue.payment_ref;
    if (revenue.period_start) oldRevenue.period_start = new Date(revenue.period_start);
    if (revenue.period_end) oldRevenue.period_end = new Date(revenue.period_end);

    await this.revenueRepo.save(oldRevenue);
    return `Revenue record updated with id ${id}`;
  }

  async deleteRevenue(id: number): Promise<string> {
    const result = (await this.revenueRepo.delete(id)).affected;
    if (result != null && result > 0) {
      return `Revenue record deleted with id ${id}`;
    } else {
      throw new NotFoundException(`Revenue record with id ${id} not found`);
    }
  }
}