import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller.js';
import { OrdersService } from './orders.service.js';
import { OrderEntity } from './entities/order.entity.js';
import { OrderItemEntity } from './entities/order-item.entity.js';
import { Product } from '../products/entities/product.entity.js';
import { PurchaseLimitsModule } from '../purchase-limits/purchase-limits.module.js';
import { BundleItem } from '../bundles/entities/bundle-item.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, OrderItemEntity, Product]),
    PurchaseLimitsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}

