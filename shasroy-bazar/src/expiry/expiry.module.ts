
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExpiryController } from './expiry.controller.js';
import { ExpiryService } from './expiry.service.js';

import { Product } from '../products/entities/product.entity.js';
import { Notification } from '../notification/entities/notification.entity.js';

import { ExpiryRemovalRecord } from './entities/expiry-removal-record.entity.js';
import { ExpirySetting } from './entities/expiry-setting.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Notification,
      ExpiryRemovalRecord,
      ExpirySetting,
    ]),
  ],
  controllers: [ExpiryController],
  providers: [ExpiryService],
  exports: [ExpiryService],
})
export class ExpiryModule {}
