
import { ApiBody } from '@nestjs/swagger';

import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AdvertisementsService } from './advertisements.service.js';
import { CreateAdvertisementDto } from './dto/create-advertisement.dto.js';
import { UpdateAdvertisementDto } from './dto/update-advertisement.dto.js';
import { SimulateAdvertisingPaymentDto } from './dto/simulate-advertising-payment.dto.js';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@Controller('advertisements')
export class AdvertisementsController {
  constructor(
    private readonly advertisementsService: AdvertisementsService,
  ) {}

  // ORGANIZATION: CREATE ADVERTISEMENT
  @ApiBody({
    schema: {
      example: {
        campaign_name: 'Winter Food Campaign',
        content_url: 'https://example.com/test/campaign.jpg',
        start_date: '2026-11-25',
        end_date: '2026-12-25',
        budget: 5000,
      },
    },
  })
  @Post('create-advertisement')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  async createAdvertisement(
    @Body() ad: CreateAdvertisementDto,
    @Req() req: any,
  ) {
    return await this.advertisementsService.createAdvertisement(
      ad,
      req.user.userId,
    );
  }

  // ORGANIZATION: SIMULATE ADVERTISEMENT PAYMENT
  @ApiBody({
    schema: {
      example: {
        payment_method: 'bKash',
        simulation_result: 'success',
        idempotency_ref: '550e8400-e29b-41d4-a716-446655440000',
      },
    },
  })
  @Post(':id/simulate-payment')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  async simulateAdvertisingPayment(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SimulateAdvertisingPaymentDto,
    @Req() req: any,
  ) {
    return await this.advertisementsService.simulateAdvertisingPayment(
      id,
      req.user.userId,
      dto,
    );
  }

  // ADMIN: GET ALL ADVERTISEMENTS
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getAllAdvertisements() {
    return await this.advertisementsService.getAllAdvertisements();
  }

  // ADMIN: GET ADVERTISEMENT BY ID
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getAdvertisementById(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.advertisementsService.getAdvertisementById(id);
  }

  // ADMIN: GET ADVERTISEMENT REVIEW HISTORY
  @Get(':id/review-history')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getAdvertisementReviewHistory(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.advertisementsService.getAdvertisementReviewHistory(
      id,
    );
  }

  // ADMIN: UPDATE ADVERTISEMENT
  @ApiBody({
    schema: {
      example: {
        campaign_name: 'Winter Food Campaign Updated',
        content_url: 'https://example.com/test/campaign-new.jpg',
        start_date: '2026-11-26',
        end_date: '2026-12-26',
        budget: 5500,
      },
    },
  })
  @Patch('update-advertisement/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateAdvertisement(
    @Param('id', ParseIntPipe) id: number,
    @Body() ad: UpdateAdvertisementDto,
  ) {
    return await this.advertisementsService.updateAdvertisement(id, ad);
  }

  // ADMIN: APPROVE ADVERTISEMENT
  @Patch('approve-advertisement/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async approveAdvertisement(
    @Param('id', ParseIntPipe) id: number,
    @Body('reason') reason: string,
    @Req() req: any,
  ) {
    return await this.advertisementsService.approveAdvertisement(
      id,
      req.user.adminId,
      reason,
    );
  }

  // ADMIN: REJECT ADVERTISEMENT
  @Patch('reject-advertisement/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async rejectAdvertisement(
    @Param('id', ParseIntPipe) id: number,
    @Body('reason') reason: string,
    @Req() req: any,
  ) {
    return await this.advertisementsService.rejectAdvertisement(
      id,
      req.user.adminId,
      reason,
    );
  }

  // ADMIN: SUSPEND ADVERTISEMENT
  @Patch('suspend-advertisement/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async suspendAdvertisement(
    @Param('id', ParseIntPipe) id: number,
    @Body('reason') reason: string,
    @Req() req: any,
  ) {
    return await this.advertisementsService.suspendAdvertisement(
      id,
      req.user.adminId,
      reason,
    );
  }

  // ADMIN: REMOVE ADVERTISEMENT
  @Patch('remove-advertisement/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async removeAdvertisement(
    @Param('id', ParseIntPipe) id: number,
    @Body('reason') reason: string,
    @Req() req: any,
  ) {
    return await this.advertisementsService.removeAdvertisement(
      id,
      req.user.adminId,
      reason,
    );
  }
}
