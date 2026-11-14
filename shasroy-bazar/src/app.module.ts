import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { EkycModule } from './ekyc/ekyc.module.js';
import { ServiceZonesModule } from './service-zones/service-zones.module.js';
import { MerchantsModule } from './merchants/merchants.module.js';
import { MerchantZonesModule } from './merchant-zones/merchant-zones.module.js';
import { AdministratorModule } from './administrator/administrator.module.js';
import { NotificationModule } from './notification/notification.module.js';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsModule } from './organizations/organizations.module.js';

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal:true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,      
    }),


    AuthModule, UsersModule, EkycModule, ServiceZonesModule, MerchantsModule, MerchantZonesModule, AdministratorModule, NotificationModule, OrganizationsModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
