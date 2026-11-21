import { Module } from '@nestjs/common';
import { ServiceZonesService } from './service-zones.service.js';
import { ServiceZonesController } from './service-zones.controller.js';
import { ServiceZone } from './entities/service-zone.entity.js';
import { Administrator } from '../administrator/entities/administrator.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
    imports: [
    TypeOrmModule.forFeature([
      ServiceZone,
      Administrator,
    ]),
  ],
  controllers: [ServiceZonesController],
  providers: [ServiceZonesService],
  exports: [ServiceZonesService],
})
export class ServiceZonesModule {}
