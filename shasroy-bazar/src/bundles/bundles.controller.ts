

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
  @ApiBody({
    schema: {
      example: {
        bundleName: 'Family Grocery Bundle',
      },
    },
  })
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
    @Param('bundleId', ParseIntPipe) bundleId: number,
    @Req() req: any,
  ) {
    return this.bundlesService.findOne(bundleId, req.user.merchantId);
  }

  // PATCH /bundles/:bundleId
  @ApiBody({
    schema: {
      example: {
        bundleName: 'Family Saver Bundle',
        bundleStatus: 'ACTIVE',
      },
    },
  })
  @Patch(':bundleId')
  update(
    @Param('bundleId', ParseIntPipe) bundleId: number,
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
    @Param('bundleId', ParseIntPipe) bundleId: number,
    @Req() req: any,
  ) {
    return this.bundlesService.remove(bundleId, req.user.merchantId);
  }

  // POST /bundles/:bundleId/items
  @ApiBody({
    schema: {
      example: {
        listingId: 1,
        quantity: 2,
      },
    },
  })
  @Post(':bundleId/items')
  addItem(
    @Param('bundleId', ParseIntPipe) bundleId: number,
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
  @ApiBody({
    schema: {
      example: {
        quantity: 3,
      },
    },
  })
  @Patch(':bundleId/items/:listingId')
  updateItem(
    @Param('bundleId', ParseIntPipe) bundleId: number,
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
    @Param('bundleId', ParseIntPipe) bundleId: number,
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
