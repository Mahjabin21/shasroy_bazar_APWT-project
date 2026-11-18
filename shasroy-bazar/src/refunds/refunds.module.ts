import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefundsService } from './refunds.service.js';
import { RefundsController } from './refunds.controller.js';
import { RefundEntity } from './entities/refund.entity.js';
import { OrderEntity } from '../orders/entities/order.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([RefundEntity, OrderEntity])],
  controllers: [RefundsController],
  providers: [RefundsService],
})
export class RefundsModule {}
