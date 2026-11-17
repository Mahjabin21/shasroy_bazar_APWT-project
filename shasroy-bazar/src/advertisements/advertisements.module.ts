import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdvertisementsService } from './advertisements.service.js';
import { AdvertisementsController } from './advertisements.controller.js';
import { Advertisement } from './entities/advertisement.entity.js';
import { Organization } from '../organizations/entities/organization.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Advertisement, Organization])],
  controllers: [AdvertisementsController],
  providers: [AdvertisementsService],
  exports: [AdvertisementsService],
})
export class AdvertisementsModule {}