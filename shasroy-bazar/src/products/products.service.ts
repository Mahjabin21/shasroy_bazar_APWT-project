import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  Product,
  ProductListingStatus,
} from './entities/product.entity.js';

import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // CREATE PRODUCT
  async create(merchantId: number, createProductDto: CreateProductDto) {
    const expiry = new Date(createProductDto.expiryDate);

    if (Number.isNaN(expiry.getTime())) {
      throw new BadRequestException('Invalid expiry date.');
    }

    const expiryDate = createProductDto.expiryDate.slice(0, 10);

    const now = new Date();
    const today =
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    if (expiryDate < today) {
      throw new BadRequestException(
        'Cannot list a product that has already expired.',
      );
    }

    // Calculate customer price (one-third of original price)
    const systemPrice = (
      Number(createProductDto.merchantOriginalPrice) / 3
    ).toFixed(2);

    const product = this.productRepository.create({
      productName: createProductDto.productName,
      category: createProductDto.category,
      description: createProductDto.description ?? null,
      quantityAvailable: createProductDto.quantityAvailable,
      unit: createProductDto.unit,
      productPhotoUrl: createProductDto.productPhotoUrl ?? null,
      expiryDate: createProductDto.expiryDate,
      expiryPhotoUrl: createProductDto.expiryPhotoUrl,
      merchantId,
      merchantOriginalPrice: createProductDto.merchantOriginalPrice,
      systemPrice,
      listingStatus: ProductListingStatus.ACTIVE,
    });

    return this.productRepository.save(product);
  }

  // GET ALL ACTIVE PRODUCTS
  async findAll() {
    return this.productRepository.find({
      where: {
        listingStatus: ProductListingStatus.ACTIVE,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // GET PRODUCTS OF A PARTICULAR MERCHANT
  async findByMerchant(merchantId: number) {
    return this.productRepository.find({
      where: { merchantId },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // GET ONE PRODUCT
  async findOne(listingId: number) {
    const product = await this.productRepository.findOne({
      where: { listingId },
    });

    if (!product) {
      throw new NotFoundException('Product listing not found.');
    }

    return product;
  }

  // UPDATE PRODUCT
  async update(
    listingId: number,
    merchantId: number,
    updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productRepository.findOne({
      where: { listingId, merchantId },
    });

    if (!product) {
      throw new NotFoundException(
        'Product listing not found or does not belong to this merchant.',
      );
    }

    if (product.listingStatus === ProductListingStatus.REMOVED) {
      throw new BadRequestException(
        'Removed listings cannot be updated.',
      );
    }

    if (updateProductDto.expiryDate) {
      const expiry = new Date(updateProductDto.expiryDate);

      if (Number.isNaN(expiry.getTime())) {
        throw new BadRequestException('Invalid expiry date.');
      }

      const expiryDate = updateProductDto.expiryDate.slice(0, 10);

      const now = new Date();
      const today =
        `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

      if (expiryDate < today) {
        throw new BadRequestException(
          'Expiry date cannot be in the past.',
        );
      }
    }

    // Update only permitted fields
    if (updateProductDto.description !== undefined) {
      product.description = updateProductDto.description;
    }

    if (updateProductDto.quantityAvailable !== undefined) {
      product.quantityAvailable = updateProductDto.quantityAvailable;
    }

    if (updateProductDto.productPhotoUrl !== undefined) {
      product.productPhotoUrl = updateProductDto.productPhotoUrl;
    }

    if (updateProductDto.expiryDate !== undefined) {
      product.expiryDate = updateProductDto.expiryDate;
    }

    if (updateProductDto.expiryPhotoUrl !== undefined) {
      product.expiryPhotoUrl = updateProductDto.expiryPhotoUrl;
    }

    return this.productRepository.save(product);
  }

  // DELETE PRODUCT (SOFT REMOVAL)
  async remove(listingId: number, merchantId: number) {
    const product = await this.productRepository.findOne({
      where: { listingId, merchantId },
    });

    if (!product) {
      throw new NotFoundException(
        'Product listing not found or does not belong to this merchant.',
      );
    }

    product.listingStatus = ProductListingStatus.REMOVED;

    return this.productRepository.save(product);
  }
}