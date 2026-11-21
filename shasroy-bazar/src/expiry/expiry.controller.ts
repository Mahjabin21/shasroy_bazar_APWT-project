
import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiBearerAuth } from '@nestjs/swagger';

import { ExpiryService } from './expiry.service.js';
import { UpdateExpiryThresholdDto } from './dto/update-expiry-threshold.dto.js';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@ApiBearerAuth('JWT-auth')
@Controller('expiry')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class ExpiryController {
  constructor(private readonly expiryService: ExpiryService) {}

  // GET /expiry/settings
  @Get('settings')
  getSetting() {
    return this.expiryService.getExpirySetting();
  }

  // PATCH /expiry/settings
  @ApiBody({
    schema: {
      example: {
        thresholdDays: 7,
      },
    },
  })
  @Patch('settings')
  updateThreshold(@Body() dto: UpdateExpiryThresholdDto) {
    return this.expiryService.updateExpiryThreshold(dto);
  }

  // POST /expiry/check
  @Post('check')
  runCheck() {
    return this.expiryService.checkExpiringProducts();
  }

  // GET /expiry/removals
  @Get('removals')
  findAllRemovalRecords() {
    return this.expiryService.findAllRemovalRecords();
  }

  // GET /expiry/removals/:listingId
  @Get('removals/:listingId')
  findRemovalRecord(
    @Param('listingId', ParseIntPipe) listingId: number,
  ) {
    return this.expiryService.findRemovalRecord(listingId);
  }
}
