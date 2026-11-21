import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DonationsService } from './donations.service.js';
import { DonationsController } from './donations.controller.js';
import { Donation } from './entities/donation.entity.js';
import { Product } from '../products/entities/product.entity.js';
import { ServiceZone } from '../service-zones/entities/service-zone.entity.js';
import { Organization } from '../organizations/entities/organization.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Donation, Product, ServiceZone, Organization]),
  ],
  controllers: [DonationsController],
  providers: [DonationsService],
})
export class DonationsModule {}