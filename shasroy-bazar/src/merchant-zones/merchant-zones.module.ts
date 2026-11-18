import { Module } from '@nestjs/common';
import { MerchantZonesService } from './merchant-zones.service.js';
import { MerchantZonesController } from './merchant-zones.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantZone } from './entities/merchant-zone.entity.js';
import { Merchant } from '../merchants/entities/merchant.entity.js';
import { ServiceZone } from '../service-zones/entities/service-zone.entity.js';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      MerchantZone,
      Merchant,
      ServiceZone,
    ]),
  ],
  controllers: [MerchantZonesController],
  providers: [MerchantZonesService],
  exports:[TypeOrmModule]
})
export class MerchantZonesModule {}
