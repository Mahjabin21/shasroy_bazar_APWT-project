

import {Injectable,NotFoundException,BadRequestException,ForbiddenException,} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';

import {
  ProductBundle,
  BundleStatus,
} from './entities/product-bundle.entity.js';

import { BundleItem } from './entities/bundle-item.entity.js';
import {
  Product,
  ProductListingStatus,
} from '../products/entities/product.entity.js';

import { CreateBundleDto } from './dto/create-bundle.dto.js';
import { UpdateBundleDto } from './dto/update-bundle.dto.js';
import { AddBundleItemDto } from './dto/add-bundle-item.dto.js';
import { UpdateBundleItemDto } from './dto/update-bundle-item.dto.js';

@Injectable()
export class BundlesService {
  constructor(
    @InjectRepository(ProductBundle)
    private readonly bundleRepository: Repository<ProductBundle>,

    

    private readonly dataSource: DataSource,
  ) {}

  // Find a bundle and verify that it belongs to the merchant.
  private async getMerchantBundle(
    manager: EntityManager,
    bundleId: number,
    merchantId: number,
  ) {
    const bundle = await manager
      .getRepository(ProductBundle)
      .findOne({
        where: { bundleId },
      });

    if (!bundle) {
      throw new NotFoundException('Bundle not found.');
    }

    if (bundle.merchantId !== merchantId) {
      throw new ForbiddenException(
        'You are not allowed to manage this bundle.',
      );
    }

    return bundle;
  }

  // Calculate the total bundle price using product system prices.
  private async calculateBundlePrice(
    manager: EntityManager,
    bundleId: number,
  ): Promise<string> {
    const items = await manager
      .getRepository(BundleItem)
      .find({
        where: { bundleId },
        relations: {
          product: true,
        },
      });

    let total = 0;

    for (const item of items) {
      const systemPrice = Number(item.product.systemPrice);
      const quantity = Number(item.quantity);

      if (!Number.isFinite(systemPrice) || systemPrice < 0) {
        throw new BadRequestException(
          `Invalid system price for product ${item.listingId}.`,
        );
      }

      total += systemPrice * quantity;
    }

    return total.toFixed(2);
  }

  // Save the newly calculated bundle price.
  private async recalculateBundlePrice(
    manager: EntityManager,
    bundle: ProductBundle,
  ) {
    bundle.bundlePrice = await this.calculateBundlePrice(
      manager,
      bundle.bundleId,
    );

    return manager.getRepository(ProductBundle).save(bundle);
  }

  // POST /bundles
  async create(merchantId: number, createBundleDto: CreateBundleDto) {
    const bundle = this.bundleRepository.create({
      bundleName: createBundleDto.bundleName,
      merchantId,
      bundlePrice: '0.00',
      bundleStatus: BundleStatus.ACTIVE,
    });

    return this.bundleRepository.save(bundle);
  }

  // GET /bundles/merchant/:merchantId
  async findByMerchant(merchantId: number) {
    return this.bundleRepository.find({
      where: { merchantId },
      relations: {
        items: {
          product: true,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // GET /bundles/merchant/:merchantId/:bundleId
  async findOne(bundleId: number, merchantId: number) {
    const bundle = await this.bundleRepository.findOne({
      where: {
        bundleId,
        merchantId,
      },
      relations: {
        items: {
          product: true,
        },
      },
    });

    if (!bundle) {
      throw new NotFoundException('Bundle not found.');
    }

    return bundle;
  }

  // PATCH /bundles/merchant/:merchantId/:bundleId
  async update(
    bundleId: number,
    merchantId: number,
    updateBundleDto: UpdateBundleDto,
  ) {
    const bundle = await this.bundleRepository.findOne({
      where: {
        bundleId,
        merchantId,
      },
    });

    if (!bundle) {
      throw new NotFoundException('Bundle not found.');
    }

    if (updateBundleDto.bundleName !== undefined) {
      bundle.bundleName = updateBundleDto.bundleName;
    }

    if (updateBundleDto.bundleStatus !== undefined) {
      bundle.bundleStatus = updateBundleDto.bundleStatus;
    }

    return this.bundleRepository.save(bundle);
  }

  // DELETE /bundles/merchant/:merchantId/:bundleId
  async remove(bundleId: number, merchantId: number) {
    const bundle = await this.bundleRepository.findOne({
      where: {
        bundleId,
        merchantId,
      },
    });

    if (!bundle) {
      throw new NotFoundException('Bundle not found.');
    }

    await this.bundleRepository.remove(bundle);

    return {
      message: 'Bundle deleted successfully.',
    };
  }

  // POST /bundles/merchant/:merchantId/:bundleId/items
  async addItem(
    bundleId: number,
    merchantId: number,
    addBundleItemDto: AddBundleItemDto,
  ) {
    return this.dataSource.transaction(async (manager) => {
      const bundle = await this.getMerchantBundle(
        manager,
        bundleId,
        merchantId,
      );

      if (bundle.bundleStatus !== BundleStatus.ACTIVE) {
        throw new BadRequestException(
          'Items cannot be added to an inactive bundle.',
        );
      }

      const product = await manager
        .getRepository(Product)
        .findOne({
          where: {
            listingId: addBundleItemDto.listingId,
          },
          lock: {
            mode: 'pessimistic_write',
          },
        });

      if (!product) {
        throw new NotFoundException('Product listing not found.');
      }

      if (product.merchantId !== merchantId) {
        throw new ForbiddenException(
          'You can only add your own products to a bundle.',
        );
      }

      if (product.listingStatus !== ProductListingStatus.ACTIVE) {
        throw new BadRequestException(
          'Only active product listings can be added.',
        );
      }

      if (product.systemPrice === null) {
        throw new BadRequestException(
          'This product does not have a valid system price.',
        );
      }

      const requestedQuantity = Number(addBundleItemDto.quantity);
      const availableQuantity = Number(product.quantityAvailable);

      if (
        !Number.isFinite(requestedQuantity) ||
        requestedQuantity <= 0
      ) {
        throw new BadRequestException(
          'Bundle quantity must be greater than zero.',
        );
      }

      if (requestedQuantity > availableQuantity) {
        throw new BadRequestException(
          'Requested quantity exceeds available product quantity.',
        );
      }

      const existingItem = await manager
        .getRepository(BundleItem)
        .findOne({
          where: {
            bundleId,
            listingId: product.listingId,
          },
        });

      if (existingItem) {
        throw new BadRequestException(
          'This product is already in the bundle. Update its quantity instead.',
        );
      }

      const bundleItem = manager
        .getRepository(BundleItem)
        .create({
          bundleId,
          listingId: product.listingId,
          bundle,
          product,
          quantity: requestedQuantity.toFixed(2),
        });

      await manager.getRepository(BundleItem).save(bundleItem);

      await this.recalculateBundlePrice(manager, bundle);

      return manager.getRepository(ProductBundle).findOne({
        where: { bundleId },
        relations: {
          items: {
            product: true,
          },
        },
      });
    });
  }

  // PATCH /bundles/merchant/:merchantId/:bundleId/items/:listingId
  async updateItem(
    bundleId: number,
    merchantId: number,
    listingId: number,
    updateBundleItemDto: UpdateBundleItemDto,
  ) {
    return this.dataSource.transaction(async (manager) => {
      const bundle = await this.getMerchantBundle(
        manager,
        bundleId,
        merchantId,
      );

      const itemRepository = manager.getRepository(BundleItem);

      const item = await itemRepository.findOne({
        where: {
          bundleId,
          listingId,
        },
        relations: {
          product: true,
        },
      });

      if (!item) {
        throw new NotFoundException(
          'Product not found in this bundle.',
        );
      }

      const requestedQuantity = Number(updateBundleItemDto.quantity);
      const availableQuantity = Number(item.product.quantityAvailable);

      if (
        !Number.isFinite(requestedQuantity) ||
        requestedQuantity <= 0
      ) {
        throw new BadRequestException(
          'Bundle quantity must be greater than zero.',
        );
      }

      if (requestedQuantity > availableQuantity) {
        throw new BadRequestException(
          'Requested quantity exceeds available product quantity.',
        );
      }

      item.quantity = requestedQuantity.toFixed(2);

      await itemRepository.save(item);

      await this.recalculateBundlePrice(manager, bundle);

      return manager.getRepository(ProductBundle).findOne({
        where: { bundleId },
        relations: {
          items: {
            product: true,
          },
        },
      });
    });
  }

  // DELETE /bundles/merchant/:merchantId/:bundleId/items/:listingId
  async removeItem(
    bundleId: number,
    merchantId: number,
    listingId: number,
  ) {
    return this.dataSource.transaction(async (manager) => {
      const bundle = await this.getMerchantBundle(
        manager,
        bundleId,
        merchantId,
      );

      const itemRepository = manager.getRepository(BundleItem);

      const item = await itemRepository.findOne({
        where: {
          bundleId,
          listingId,
        },
      });

      if (!item) {
        throw new NotFoundException(
          'Product not found in this bundle.',
        );
      }

      await itemRepository.remove(item);

      await this.recalculateBundlePrice(manager, bundle);

      return manager.getRepository(ProductBundle).findOne({
        where: { bundleId },
        relations: {
          items: {
            product: true,
          },
        },
      });
    });
  }
}
