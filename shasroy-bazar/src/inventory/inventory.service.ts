import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product, ProductListingStatus } from '../products/entities/product.entity.js';
import { InventoryAdjustment } from './entities/inventory-adjustment.entity.js';
import { AdjustStockDto } from './dto/adjust-stock.dto.js';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Product) private readonly products: Repository<Product>,
    @InjectRepository(InventoryAdjustment) private readonly adjustments: Repository<InventoryAdjustment>,
    private readonly dataSource: DataSource,
  ) {}

 async getStock(listingId: number, merchantId: number) {
  const product = await this.products.findOne({
    where: { listingId, merchantId },
  });

  if (!product) {
    throw new NotFoundException('Product listing not found for this merchant');
  }

  return {
    listingId,
    productName: product.productName,
    quantityAvailable: Number(product.quantityAvailable),
    unit: product.unit,
    listingStatus: product.listingStatus,
  };
}

  async adjustStock(listingId: number, merchantId: number, dto: AdjustStockDto) {
    return this.dataSource.transaction(async manager => {
      const repo = manager.getRepository(Product);
      const product = await repo.findOne({ where: { listingId, merchantId }, lock: { mode: 'pessimistic_write' } });
      if (!product) 
        throw new NotFoundException('Product listing not found for this merchant');

      if (product.listingStatus !== ProductListingStatus.ACTIVE)
         throw new BadRequestException('Removed products cannot be restocked');

      const before = Number(product.quantityAvailable);
      const after = before + dto.quantity;
      if (after < 0) 
        throw new BadRequestException('Stock cannot become negative');


      product.quantityAvailable = after;
      await repo.save(product);

      const adjustment = manager.getRepository(InventoryAdjustment).create({
         listingId,
         merchantId, 
         quantityChange: dto.quantity.toFixed(2), 
         reason: dto.reason,
         note: dto.note ?? null,
      });
      await manager.getRepository(InventoryAdjustment).save(adjustment);
      return { message: 'Stock updated successfully', 
         listingId, previousQuantity: before,
         quantityChange: dto.quantity,
         quantityAvailable: after, adjustment };
    });
  }

  async getHistory(listingId: number, merchantId: number) {
    const product = await this.products.findOne({ where: { listingId, merchantId } });
    if (!product)
         throw new NotFoundException('Product listing not found for this merchant');

    return this.adjustments.find({ where:
         { listingId, merchantId }, 
         order: { createdAt: 'DESC' } });
  }
}
