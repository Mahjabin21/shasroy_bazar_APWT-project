import { Module } from '@nestjs/common';
import { ServiceZonesService } from './service-zones.service.js';
import { ServiceZonesController } from './service-zones.controller.js';

@Module({
   //imports: [TypeOrmModule.forFeature([User])],
  controllers: [ServiceZonesController],
  providers: [ServiceZonesService],
})
export class ServiceZonesModule {}
