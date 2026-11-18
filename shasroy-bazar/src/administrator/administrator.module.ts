import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdministratorService } from './administrator.service.js';
import { AdministratorController } from './administrator.controller.js';
import { Administrator } from './entities/administrator.entity.js';
import { Merchant } from '../merchants/entities/merchant.entity.js';
import { EkycVerification } from '../ekyc/entities/ekyc-verification.entity.js';
import { User } from '../users/entities/user.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Administrator, Merchant, EkycVerification, User]),
  ],
  controllers: [AdministratorController],
  providers: [AdministratorService],
  exports: [TypeOrmModule],
})
export class AdministratorModule {}