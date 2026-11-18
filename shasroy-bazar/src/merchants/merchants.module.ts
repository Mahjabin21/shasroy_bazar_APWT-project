import { Module } from '@nestjs/common';
import { MerchantsService } from './merchants.service.js';
import { MerchantsController } from './merchants.controller.js';
import { Merchant } from './entities/merchant.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity.js';
@Module({
  imports: [TypeOrmModule.forFeature([Merchant,User])],
  controllers: [MerchantsController],
  providers: [MerchantsService],
  exports:[TypeOrmModule],
})
export class MerchantsModule {}
