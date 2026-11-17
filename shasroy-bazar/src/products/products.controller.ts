
import {Controller,Get,Post,Body,Param, Patch, Delete, ParseUUIDPipe,} from '@nestjs/common';

import { ProductsService } from './products.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
  ) {}

  // POST /products
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // GET /products
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // GET /products/merchant/:merchantId
  @Get('merchant/:merchantId')
  findByMerchant(
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
  ) {
    return this.productsService.findByMerchant(merchantId);
  }

  // PATCH /products/merchant/:merchantId/:listingId
  @Patch('merchant/:merchantId/:listingId')
  update(
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
    @Param('listingId', ParseUUIDPipe) listingId: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(
      listingId,
      merchantId,
      updateProductDto,
    );
  }

  // DELETE /products/merchant/:merchantId/:listingId
  @Delete('merchant/:merchantId/:listingId')
  remove(
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
    @Param('listingId', ParseUUIDPipe) listingId: string,
  ) {
    return this.productsService.remove(listingId, merchantId);
  }

  // GET /products/:listingId
  @Get(':listingId')
  findOne(
    @Param('listingId', ParseUUIDPipe) listingId: string,
  ) {
    return this.productsService.findOne(listingId);
  }
}
