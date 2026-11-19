
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BundlesController } from './bundles.controller.js';
import { BundlesService } from './bundles.service.js';

import { ProductBundle } from './entities/product-bundle.entity.js';
import { BundleItem } from './entities/bundle-item.entity.js';
import { Product } from '../products/entities/product.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductBundle,
      BundleItem,
      Product,
    ]),
  ],
  controllers: [BundlesController],
  providers: [BundlesService],
  exports: [BundlesService],
})
export class BundlesModule {}

