import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';

import { MerchantZonesService } from './merchant-zones.service.js';
import { AssignMerchantZoneDto } from './dto/assign-merchant-zone.dto.js';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@ApiBearerAuth('JWT-auth')
@Controller('merchant-zones')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class MerchantZonesController {
  constructor(
    private readonly merchantZonesService: MerchantZonesService,
  ) {}

  // Assign a service zone to a merchant
    // Assign a service zone to a merchant
  @ApiBody({
    schema: {
      example: {
        merchantId: 1,
        zoneId: 1,
      },
    },
  })
  @Post('assign')
  assignZone(@Body() dto: AssignMerchantZoneDto) {
    return this.merchantZonesService.assignZone(dto);
  }
  
  // Get all zones assigned to a merchant
  @Get('merchant/:merchantId')
  getMerchantZones(
    @Param('merchantId', ParseIntPipe) merchantId: number,
  ) {
    return this.merchantZonesService.getMerchantZones(merchantId);
  }

  // Remove a merchant from a service zone
  @Delete(':merchantId/:zoneId')
  removeZone(
    @Param('merchantId', ParseIntPipe) merchantId: number,
    @Param('zoneId', ParseIntPipe) zoneId: number,
  ) {
    return this.merchantZonesService.removeZone(merchantId, zoneId);
  }
}