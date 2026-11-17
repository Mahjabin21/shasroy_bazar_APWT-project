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

@Injectable()
export class AdvertisementsService {
  constructor(
    @InjectRepository(Advertisement)
    private readonly adRepo: Repository<Advertisement>,
    @InjectRepository(Organization)
    private readonly orgRepo: Repository<Organization>,
  ) {}

  async createAdvertisement(ad: CreateAdvertisementDto): Promise<Advertisement> {
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

  async getAllAdvertisements(): Promise<Advertisement[]> {
    return await this.adRepo.find({
            relations: {
        organization: true,
      },
    });
  }

  async getAdvertisementById(id: number): Promise<Advertisement> {
    const ad = await this.adRepo.findOne({
      where: {
        ad_id: id,
      },
            relations: {
        organization: true,
      },
    });
    if (!ad) {
      throw new NotFoundException(`Advertisement with id ${id} not found`);
    }
    return ad;
  }

  async updateAdvertisement(
    id: number,
    ad: UpdateAdvertisementDto,
  ): Promise<string> {
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

  async approveAdvertisement(id: number): Promise<string> {
    const result = (
      await this.adRepo.update(id, {
        ad_status: 'approved',
      })
    ).affected;
    if (result != undefined && result > 0) {
      return `Advertisement approved with id ${id}`;
    } else {
      throw new NotFoundException(`Advertisement with id ${id} not found`);
    }
  }

  async deleteAdvertisement(id: number): Promise<string> {
    const result = (await this.adRepo.delete(id)).affected;
    if (result != null && result > 0) {
      return `Advertisement deleted with id ${id}`;
    } else {
      throw new NotFoundException(`Advertisement with id ${id} not found`);
    }
  }
}