import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdministratorService } from './administrator.service.js';
import { AdministratorController } from './administrator.controller.js';
import { Administrator } from './entities/administrator.entity.js';
import { Merchant } from '../merchants/entities/merchant.entity.js';
import { EkycVerification } from '../ekyc/entities/ekyc-verification.entity.js';
import { User } from '../users/entities/user.entity.js';
<<<<<<< HEAD
import { Organization } from '../organizations/entities/organization.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Administrator, Merchant, EkycVerification, User,Organization]),
=======

@Module({
  imports: [
    TypeOrmModule.forFeature([Administrator, Merchant, EkycVerification, User]),
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
  ],
  controllers: [AdministratorController],
  providers: [AdministratorService],
  exports: [TypeOrmModule],
})
export class AdministratorModule {}