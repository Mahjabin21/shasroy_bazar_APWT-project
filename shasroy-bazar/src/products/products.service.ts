import { Injectable,NotFoundException, BadRequestException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {Product, ProductListingStatus,} from './entities/product.entity.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';


@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  
  ) {}
// create product
 async create(createProductDto: CreateProductDto) {
  const expiry = new Date(createProductDto.expiryDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (expiry < today) {
    throw new BadRequestException(
      'Cannot list a product that has already expired.',
    );
  }

  const product = this.productRepository.create({
    ...createProductDto,

    description: createProductDto.description ?? null,
    productPhotoUrl: createProductDto.productPhotoUrl ?? null,

    merchantOriginalPrice: createProductDto.merchantOriginalPrice,
    systemPrice: null,

    listingStatus: ProductListingStatus.ACTIVE,

    reviewedAt: null,
    reviewedByAdminId: null,
    rejectionReason: null,
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
  async findByMerchant(merchantId: string) {
    return this.productRepository.find({
      where: { merchantId },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // GET ONE PRODUCT
  async findOne(listingId: string) {
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
    listingId: string,
    merchantId: string,
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
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (expiry < today) {
        throw new BadRequestException(
          'Expiry date cannot be in the past.',
        );
      }
    }

    // Do not allow changing ownership through an update.
    
    Object.assign(product, updateProductDto);
    
    return this.productRepository.save(product);
  }

  // DELETE PRODUCT (SOFT REMOVAL)
  async remove(listingId: string, merchantId: string) {
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
