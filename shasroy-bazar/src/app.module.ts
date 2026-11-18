
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { EkycModule } from './ekyc/ekyc.module.js';
import { ServiceZonesModule } from './service-zones/service-zones.module.js';
import { MerchantsModule } from './merchants/merchants.module.js';
import { MerchantZonesModule } from './merchant-zones/merchant-zones.module.js';
import { AdministratorModule } from './administrator/administrator.module.js';
import { NotificationModule } from './notification/notification.module.js';

import { LoggerMiddleware } from './common/middleware/logger.middleware.js';
import { ExpiryModule } from './expiry/expiry.module.js';
import { ProductsModule } from './products/products.module.js';
import { OrdersModule } from './orders/orders.module.js';
import { BundlesModule } from './bundles/bundles.module.js';
import { PaymentsModule } from './payment/payment.module.js';
import { InventoryModule } from './inventory/inventory.module.js';

import { PurchaseLimitsModule } from './purchase-limits/purchase-limits.module.js';
import { RefundsModule } from './refunds/refunds.module.js';
import { DeliveryModule } from './delivery/delivery.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: false,
    }),

    AuthModule,
    UsersModule,
    EkycModule,
    ServiceZonesModule,
    MerchantsModule,
    MerchantZonesModule,
    AdministratorModule,
    NotificationModule,

    ExpiryModule,
    ProductsModule,
    OrdersModule,
    BundlesModule,
    PaymentsModule,
    InventoryModule,

    PurchaseLimitsModule,
    RefundsModule,
    DeliveryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
