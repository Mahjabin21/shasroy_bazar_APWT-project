import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryService } from './delivery.service.js';
import { DeliveryController } from './delivery.controller.js';
import { DeliveryEntity } from './entities/delivery.entity.js';
import { OrderEntity } from '../orders/entities/order.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryEntity, OrderEntity])],
  controllers: [DeliveryController],
  providers: [DeliveryService],
  exports: [DeliveryService],
})
export class DeliveryModule {}
