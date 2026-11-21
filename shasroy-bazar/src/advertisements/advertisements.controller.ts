
import { ApiBody } from '@nestjs/swagger';
<<<<<<< HEAD

import {
  Body,
  Controller,
=======
import {
  Body,
  Controller,
  Delete,
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
<<<<<<< HEAD

import { AdvertisementsService } from './advertisements.service.js';
import { CreateAdvertisementDto } from './dto/create-advertisement.dto.js';
import { UpdateAdvertisementDto } from './dto/update-advertisement.dto.js';
import { SimulateAdvertisingPaymentDto } from './dto/simulate-advertising-payment.dto.js';

=======
import { AdvertisementsService } from './advertisements.service.js';
import { CreateAdvertisementDto } from './dto/create-advertisement.dto.js';
import { UpdateAdvertisementDto } from './dto/update-advertisement.dto.js';
import { Advertisement } from './entities/advertisement.entity.js';
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@Controller('advertisements')
export class AdvertisementsController {
<<<<<<< HEAD
  constructor(
    private readonly advertisementsService: AdvertisementsService,
  ) {}

  // ORGANIZATION: CREATE ADVERTISEMENT
=======
  constructor(private readonly advertisementsService: AdvertisementsService) {}

>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
  @ApiBody({
    schema: {
      example: {
        campaign_name: 'Winter Food Campaign',
        content_url: 'https://example.com/test/campaign.jpg',
<<<<<<< HEAD
        start_date: '2026-11-25',
        end_date: '2026-12-25',
        budget: 5000,
=======
        start_date: '2026-11-20',
        end_date: '2026-12-20',
        budget: 5000,
        org_id: 1,
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
      },
    },
  })
  @Post('create-advertisement')
  @UseGuards(JwtAuthGuard, RolesGuard)
<<<<<<< HEAD
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
=======
  @Roles('admin')
  async createAdvertisement(
    @Body() ad: CreateAdvertisementDto,
  ) {
    return await this.advertisementsService.createAdvertisement(ad);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllAdvertisements(){
    return await this.advertisementsService.getAllAdvertisements();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
  async getAdvertisementById(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.advertisementsService.getAdvertisementById(id);
  }

<<<<<<< HEAD
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
=======
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
  @ApiBody({
    schema: {
      example: {
        campaign_name: 'Winter Food Campaign Updated',
        content_url: 'https://example.com/test/campaign-new.jpg',
<<<<<<< HEAD
        start_date: '2026-11-26',
        end_date: '2026-12-26',
        budget: 5500,
=======
        start_date: '2026-11-21',
        end_date: '2026-12-21',
        budget: 5500,
        org_id: 1,
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
      },
    },
  })
  @Patch('update-advertisement/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateAdvertisement(
    @Param('id', ParseIntPipe) id: number,
    @Body() ad: UpdateAdvertisementDto,
<<<<<<< HEAD
  ) {
    return await this.advertisementsService.updateAdvertisement(id, ad);
  }

  // ADMIN: APPROVE ADVERTISEMENT
=======
  ){
    return await this.advertisementsService.updateAdvertisement(id, ad);
  }

>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
  @Patch('approve-advertisement/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async approveAdvertisement(
    @Param('id', ParseIntPipe) id: number,
<<<<<<< HEAD
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
=======
    @Req() req: any,
  ){
    return await this.advertisementsService.approveAdvertisement(
      id,
      req.user.adminId,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteAdvertisement(
    @Param('id', ParseIntPipe) id: number,
  ){
    return await this.advertisementsService.deleteAdvertisement(id);
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
  }
}
