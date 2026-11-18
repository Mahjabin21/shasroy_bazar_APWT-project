import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaymentsController } from './payment.controller.js';
import { PaymentsService } from './payment.service.js';

import { PaymentEntity } from './entities/payment.entity.js';
import { OrderEntity } from '../orders/entities/order.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PaymentEntity,
      OrderEntity,
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}

