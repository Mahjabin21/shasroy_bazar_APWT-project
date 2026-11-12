import { Module } from '@nestjs/common';
import { MerchantZonesService } from './merchant-zones.service.js';
import { MerchantZonesController } from './merchant-zones.controller.js';

@Module({
  //imports: [TypeOrmModule.forFeature([User])],
  controllers: [MerchantZonesController],
  providers: [MerchantZonesService],
})
export class MerchantZonesModule {}
