
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBody,
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { Request } from 'express';

import { InventoryService } from './inventory.service.js';
import { AdjustStockDto } from './dto/adjust-stock.dto.js';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';

interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
    merchantId: number;
    role: string;
    accountType: string;
  };
}

@ApiBearerAuth('JWT-auth')
@ApiTags('Inventory')
@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('merchant')
export class InventoryController {
  constructor(
    private readonly inventory: InventoryService,
  ) {}

  // GET /inventory/:listingId
  // Get current stock for a merchant product listing
  @Get(':listingId')
  @ApiOperation({
    summary: 'Get current stock for a merchant product listing',
  })
  getStock(
    @Param('listingId', ParseIntPipe) listingId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.inventory.getStock(
      listingId,
      req.user.merchantId,
    );
  }

  // POST /inventory/:listingId/adjust
  // Adjust stock for a merchant product listing
  @ApiBody({
    schema: {
      example: {
        quantity: 10,
        reason: 'RESTOCK',
        note: 'Weekly supplier delivery',
      },
    },
  })
  @Post(':listingId/adjust')
  @ApiOperation({
    summary: 'Adjust stock for a merchant product listing',
  })
  adjustStock(
    @Param('listingId', ParseIntPipe) listingId: number,
    @Req() req: AuthenticatedRequest,
    @Body() dto: AdjustStockDto,
  ) {
    return this.inventory.adjustStock(
      listingId,
      req.user.merchantId,
      dto,
    );
  }

  // GET /inventory/:listingId/history
  // Get stock adjustment history for a merchant listing
  @Get(':listingId/history')
  @ApiOperation({
    summary: 'Get stock adjustment history for a merchant listing',
  })
  getHistory(
    @Param('listingId', ParseIntPipe) listingId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.inventory.getHistory(
      listingId,
      req.user.merchantId,
    );
  }
}
