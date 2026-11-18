
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseUUIDPipe,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { BundlesService } from './bundles.service.js';

import { CreateBundleDto } from './dto/create-bundle.dto.js';
import { UpdateBundleDto } from './dto/update-bundle.dto.js';
import { AddBundleItemDto } from './dto/add-bundle-item.dto.js';
import { UpdateBundleItemDto } from './dto/update-bundle-item.dto.js';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@ApiBearerAuth('JWT-auth')
@Controller('bundles')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('merchant')
export class BundlesController {
  constructor(
    private readonly bundlesService: BundlesService,
  ) {}

  // POST /bundles
  @Post()
  create(
    @Body() createBundleDto: CreateBundleDto,
    @Req() req: any,
  ) {
    return this.bundlesService.create(
      req.user.merchantId,
      createBundleDto,
    );
  }

  // GET /bundles
  @Get()
  findByMerchant(@Req() req: any) {
    return this.bundlesService.findByMerchant(req.user.merchantId);
  }

  // GET /bundles/:bundleId
  @Get(':bundleId')
  findOne(
    @Param('bundleId', ParseUUIDPipe) bundleId: string,
    @Req() req: any,
  ) {
    return this.bundlesService.findOne(bundleId, req.user.merchantId);
  }

  // PATCH /bundles/:bundleId
  @Patch(':bundleId')
  update(
    @Param('bundleId', ParseUUIDPipe) bundleId: string,
    @Body() updateBundleDto: UpdateBundleDto,
    @Req() req: any,
  ) {
    return this.bundlesService.update(
      bundleId,
      req.user.merchantId,
      updateBundleDto,
    );
  }

  // DELETE /bundles/:bundleId
  @Delete(':bundleId')
  remove(
    @Param('bundleId', ParseUUIDPipe) bundleId: string,
    @Req() req: any,
  ) {
    return this.bundlesService.remove(bundleId, req.user.merchantId);
  }

  // POST /bundles/:bundleId/items
  @Post(':bundleId/items')
  addItem(
    @Param('bundleId', ParseUUIDPipe) bundleId: string,
    @Body() addBundleItemDto: AddBundleItemDto,
    @Req() req: any,
  ) {
    return this.bundlesService.addItem(
      bundleId,
      req.user.merchantId,
      addBundleItemDto,
    );
  }

  // PATCH /bundles/:bundleId/items/:listingId
  @Patch(':bundleId/items/:listingId')
  updateItem(
    @Param('bundleId', ParseUUIDPipe) bundleId: string,
    @Param('listingId', ParseIntPipe) listingId: number,
    @Body() updateBundleItemDto: UpdateBundleItemDto,
    @Req() req: any,
  ) {
    return this.bundlesService.updateItem(
      bundleId,
      req.user.merchantId,
      listingId,
      updateBundleItemDto,
    );
  }

  // DELETE /bundles/:bundleId/items/:listingId
  @Delete(':bundleId/items/:listingId')
  removeItem(
    @Param('bundleId', ParseUUIDPipe) bundleId: string,
    @Param('listingId', ParseIntPipe) listingId: number,
    @Req() req: any,
  ) {
    return this.bundlesService.removeItem(
      bundleId,
      req.user.merchantId,
      listingId,
    );
  }
}
