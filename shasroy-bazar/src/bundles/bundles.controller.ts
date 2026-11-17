
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';

import { BundlesService } from './bundles.service.js';

import { CreateBundleDto } from './dto/create-bundle.dto.js';
import { UpdateBundleDto } from './dto/update-bundle.dto.js';
import { AddBundleItemDto } from './dto/add-bundle-item.dto.js';
import { UpdateBundleItemDto } from './dto/update-bundle-item.dto.js';

@Controller('bundles')
export class BundlesController {
  constructor(
    private readonly bundlesService: BundlesService,
  ) {}

  // POST /bundles
  @Post()
  create(@Body() createBundleDto: CreateBundleDto) {
    return this.bundlesService.create(createBundleDto);
  }

  // GET /bundles/merchant/:merchantId
  @Get('merchant/:merchantId')
  findByMerchant(
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
  ) {
    return this.bundlesService.findByMerchant(merchantId);
  }

  // GET /bundles/merchant/:merchantId/:bundleId
  @Get('merchant/:merchantId/:bundleId')
  findOne(
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
    @Param('bundleId', ParseUUIDPipe) bundleId: string,
  ) {
    return this.bundlesService.findOne(bundleId, merchantId);
  }

  // PATCH /bundles/merchant/:merchantId/:bundleId
  @Patch('merchant/:merchantId/:bundleId')
  update(
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
    @Param('bundleId', ParseUUIDPipe) bundleId: string,
    @Body() updateBundleDto: UpdateBundleDto,
  ) {
    return this.bundlesService.update(
      bundleId,
      merchantId,
      updateBundleDto,
    );
  }

  // DELETE /bundles/merchant/:merchantId/:bundleId
  @Delete('merchant/:merchantId/:bundleId')
  remove(
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
    @Param('bundleId', ParseUUIDPipe) bundleId: string,
  ) {
    return this.bundlesService.remove(bundleId, merchantId);
  }

  // POST /bundles/merchant/:merchantId/:bundleId/items
  @Post('merchant/:merchantId/:bundleId/items')
  addItem(
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
    @Param('bundleId', ParseUUIDPipe) bundleId: string,
    @Body() addBundleItemDto: AddBundleItemDto,
  ) {
    return this.bundlesService.addItem(
      bundleId,
      merchantId,
      addBundleItemDto,
    );
  }

  // PATCH /bundles/merchant/:merchantId/:bundleId/items/:listingId
  @Patch('merchant/:merchantId/:bundleId/items/:listingId')
  updateItem(
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
    @Param('bundleId', ParseUUIDPipe) bundleId: string,
    @Param('listingId', ParseUUIDPipe) listingId: string,
    @Body() updateBundleItemDto: UpdateBundleItemDto,
  ) {
    return this.bundlesService.updateItem(
      bundleId,
      merchantId,
      listingId,
      updateBundleItemDto,
    );
  }

  // DELETE /bundles/merchant/:merchantId/:bundleId/items/:listingId
  @Delete('merchant/:merchantId/:bundleId/items/:listingId')
  removeItem(
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
    @Param('bundleId', ParseUUIDPipe) bundleId: string,
    @Param('listingId', ParseUUIDPipe) listingId: string,
  ) {
    return this.bundlesService.removeItem(
      bundleId,
      merchantId,
      listingId,
    );
  }
}
