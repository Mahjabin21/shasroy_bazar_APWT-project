import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Donation } from './entities/donation.entity.js';
import { Product } from '../products/entities/product.entity.js';
import { ServiceZone } from '../service-zones/entities/service-zone.entity.js';
import { Organization } from '../organizations/entities/organization.entity.js';
import { CreateDonationDto } from './dto/create-donation.dto.js';
import { AllocateDonationDto } from './dto/allocate-donation.dto.js';
import { RejectDonationDto } from './dto/reject-donation.dto.js';

@Injectable()
export class DonationsService {
  constructor(
    @InjectRepository(Donation)
    private readonly donationRepo: Repository<Donation>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(ServiceZone)
    private readonly zoneRepo: Repository<ServiceZone>,
    @InjectRepository(Organization)
    private readonly orgRepo: Repository<Organization>,
    private readonly dataSource: DataSource,
  ) {}

  // FR-39: check if the product can be donated
  async checkEligibility(donation: CreateDonationDto): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: {
        listingId: donation.listing_id,
      },
    });
    if (!product) {
      throw new NotFoundException(`Product with id ${donation.listing_id} not found`);
    }
    if (product.listingStatus !== 'ACTIVE') {
      throw new BadRequestException('This product is not active, so it cannot be donated');
    }
    if (new Date(product.expiryDate) < new Date()) {
      throw new BadRequestException('This product is expired, so it cannot be donated');
    }
    if (Number(product.quantityAvailable) < donation.quantity) {
      throw new BadRequestException('Not enough quantity available to donate');
    }

    const zone = await this.zoneRepo.findOne({
      where: {
        zoneId: donation.zone_id,
      },
    });
    if (!zone) {
      throw new NotFoundException(`Zone with id ${donation.zone_id} not found`);
    }
    return product;
  }

  // FR-36: user donation
  async userDonation(donation: CreateDonationDto, userId: number): Promise<Donation> {
    await this.checkEligibility(donation);
    const newDonation = await this.donationRepo.create({
      quantity: donation.quantity,
      user: { userId: userId },
      listing: { listingId: donation.listing_id },
      zone: { zoneId: donation.zone_id },
    });
    return await this.donationRepo.save(newDonation);
  }

  // FR-37: merchant donation (transaction: save donation + reduce product stock)
  async merchantDonation(donation: CreateDonationDto, merchantId: number): Promise<Donation> {
    const product = await this.checkEligibility(donation);
    if (product.merchantId !== merchantId) {
      throw new ForbiddenException('You can only donate your own products');
    }

    return await this.dataSource.transaction(async (manager) => {
      await manager.update(Product, donation.listing_id, {
        quantityAvailable: Number(product.quantityAvailable) - donation.quantity,
      });
      const newDonation = manager.create(Donation, {
        quantity: donation.quantity,
        merchant: { merchantId: merchantId },
        listing: { listingId: donation.listing_id },
        zone: { zoneId: donation.zone_id },
      });
      return await manager.save(newDonation);
    });
  }

  // FR-38: donation listing (admin)
  async getAllDonations(): Promise<Donation[]> {
    return await this.donationRepo.find({
      relations: {
        listing: true,
        zone: true,
        allocatedOrg: true,
      },
    });
  }

  async getDonationById(id: number): Promise<Donation> {
    const donation = await this.donationRepo.findOne({
      where: {
        donation_id: id,
      },
      relations: {
        listing: true,
        zone: true,
        allocatedOrg: true,
      },
    });
    if (!donation) {
      throw new NotFoundException(`Donation with id ${id} not found`);
    }
    return donation;
  }

  // FR-41: donation tracking (user sees own donations)
  async getUserDonations(userId: number): Promise<Donation[]> {
    return await this.donationRepo.find({
      where: {
        user: { userId: userId },
      },
      relations: {
        listing: true,
        allocatedOrg: true,
      },
    });
  }

  // FR-41: donation tracking (merchant sees own donations)
  async getMerchantDonations(merchantId: number): Promise<Donation[]> {
    return await this.donationRepo.find({
      where: {
        merchant: { merchantId: merchantId },
      },
      relations: {
        listing: true,
        allocatedOrg: true,
      },
    });
  }

  // FR-40: recipient allocation (admin)
  async allocateDonation(id: number, data: AllocateDonationDto): Promise<string> {
    const donation = await this.getDonationById(id);
    if (donation.donation_status !== 'pending') {
      throw new BadRequestException('Only pending donations can be allocated');
    }

    const org = await this.orgRepo.findOne({
      where: {
        org_id: data.org_id,
      },
    });
    if (!org) {
      throw new NotFoundException(`Organization with id ${data.org_id} not found`);
    }
    if (org.organization_status !== 'verified') {
      throw new BadRequestException('Organization is not verified');
    }

    donation.allocatedOrg = org;
    donation.donation_status = 'allocated';
    donation.allocated_at = new Date();
    await this.donationRepo.save(donation);
    return `Donation ${id} allocated to organization ${data.org_id}`;
  }

  // FR-39: admin rejects a donation
  async rejectDonation(id: number, data: RejectDonationDto): Promise<string> {
    const donation = await this.getDonationById(id);
    if (donation.donation_status !== 'pending') {
      throw new BadRequestException('Only pending donations can be rejected');
    }
    donation.donation_status = 'rejected';
    donation.rejection_reason = data.rejection_reason;
    await this.donationRepo.save(donation);
    return `Donation ${id} rejected`;
  }

  // FR-41: admin marks donation as delivered
  async deliverDonation(id: number): Promise<string> {
    const donation = await this.getDonationById(id);
    if (donation.donation_status !== 'allocated') {
      throw new BadRequestException('Only allocated donations can be marked as delivered');
    }
    donation.donation_status = 'delivered';
    await this.donationRepo.save(donation);
    return `Donation ${id} marked as delivered`;
  }
}