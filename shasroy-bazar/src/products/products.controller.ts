

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ApiBody, ApiBearerAuth } from '@nestjs/swagger';

import { ProductsService } from './products.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@ApiBearerAuth('JWT-auth')
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
  ) {}

  // POST /products
  @ApiBody({
    schema: {
      example: {
        productName: 'Fresh Mango',
        category: 'Fruits',
        description: 'Fresh seasonal mangoes',
        quantityAvailable: 50,
        unit: 'kg',
        productPhotoUrl: 'https://example.com/test/mango.jpg',
        expiryDate: '2026-12-15',
        expiryPhotoUrl: 'https://example.com/test/mango-expiry.jpg',
        merchantOriginalPrice: 120,
      },
    },
  })
  @Post()
  @Roles('merchant')
  create(
    @Body() createProductDto: CreateProductDto,
    @Req() req: any,
  ) {
    return this.productsService.create(
      req.user.merchantId,
      createProductDto,
    );
  }

  // GET /products
  @Get()
  @Roles('user', 'merchant', 'admin')
  findAll() {
    return this.productsService.findAll();
  }

  // GET /products/my
  @Get('my')
  @Roles('merchant')
  findMine(@Req() req: any) {
    return this.productsService.findByMerchant(req.user.merchantId);
  }

  // PATCH /products/:listingId
  @ApiBody({
    schema: {
      example: {
        description: 'Updated product description',
        quantityAvailable: 45,
        productPhotoUrl: 'https://example.com/test/mango-new.jpg',
        expiryDate: '2026-12-20',
        expiryPhotoUrl: 'https://example.com/test/mango-expiry-new.jpg',
      },
    },
  })
  @Patch(':listingId')
  @Roles('merchant')
  update(
    @Param('listingId', ParseIntPipe) listingId: number,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req: any,
  ) {
    return this.productsService.update(
      listingId,
      req.user.merchantId,
      updateProductDto,
    );
  }

  // DELETE /products/:listingId
  @Delete(':listingId')
  @Roles('merchant')
  remove(
    @Param('listingId', ParseIntPipe) listingId: number,
    @Req() req: any,
  ) {
    return this.productsService.remove(listingId, req.user.merchantId);
  }

  // GET /products/:listingId
  @Get(':listingId')
  @Roles('user', 'merchant', 'admin')
  findOne(
    @Param('listingId', ParseIntPipe) listingId: number,
  ) {
    return this.productsService.findOne(listingId);
  }
}
