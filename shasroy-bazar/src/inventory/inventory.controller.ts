
import { Body,Controller, Get,Param,ParseIntPipe,Post,Req,UseGuards,} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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

@ApiTags('Inventory')
@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('merchant')
export class InventoryController {
  constructor(private readonly inventory: InventoryService) {}

  @Get(':listingId')
  @ApiOperation({ summary: 'Get current stock for a merchant product listing' })
  getStock(
    @Param('listingId', ParseIntPipe) listingId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.inventory.getStock(listingId, req.user.merchantId);
  }

  @Post(':listingId/adjust')
  @ApiOperation({ summary: 'Adjust stock for a merchant product listing' })
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

  @Get(':listingId/history')
  @ApiOperation({ summary: 'Get stock adjustment history for a merchant listing' })
  getHistory(
    @Param('listingId', ParseIntPipe) listingId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.inventory.getHistory(listingId, req.user.merchantId);
  }
}
