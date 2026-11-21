
<<<<<<< HEAD
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
=======
import { ApiBody } from '@nestjs/swagger';
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
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
import { DonationsService } from './donations.service.js';
import { CreateDonationDto } from './dto/create-donation.dto.js';
import { AllocateDonationDto } from './dto/allocate-donation.dto.js';
import { RejectDonationDto } from './dto/reject-donation.dto.js';
import { Donation } from './entities/donation.entity.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@Controller('donations')
<<<<<<< HEAD
@ApiBearerAuth('JWT-auth')
=======
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @ApiBody({
    schema: {
      example: {
        listing_id: 1,
        zone_id: 1,
        quantity: 2,
      },
    },
  })
  @Post('user-donate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  async userDonation(
    @Body() donation: CreateDonationDto,
    @Req() req: any,
  ): Promise<Donation> {
    return await this.donationsService.userDonation(donation, req.user.userId);
  }

  @ApiBody({
    schema: {
      example: {
        listing_id: 1,
        zone_id: 1,
        quantity: 5,
      },
    },
  })
  @Post('merchant-donate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('merchant')
  async merchantDonation(
    @Body() donation: CreateDonationDto,
    @Req() req: any,
  ): Promise<Donation> {
    return await this.donationsService.merchantDonation(donation, req.user.merchantId);
  }

  @Get('my-donations')
  @UseGuards(JwtAuthGuard, RolesGuard)
<<<<<<< HEAD
  @Roles('user','merchant')
=======
  @Roles('user')
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
  async getUserDonations(@Req() req: any): Promise<Donation[]> {
    return await this.donationsService.getUserDonations(req.user.userId);
  }

  @Get('merchant-donations')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('merchant')
  async getMerchantDonations(@Req() req: any): Promise<Donation[]> {
    return await this.donationsService.getMerchantDonations(req.user.merchantId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getAllDonations(): Promise<Donation[]> {
    return await this.donationsService.getAllDonations();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getDonationById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Donation> {
    return await this.donationsService.getDonationById(id);
  }

  @ApiBody({
    schema: {
      example: {
        org_id: 1,
      },
    },
  })
  @Patch('allocate/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async allocateDonation(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: AllocateDonationDto,
  ): Promise<string> {
    return await this.donationsService.allocateDonation(id, data);
  }

  @ApiBody({
    schema: {
      example: {
        rejection_reason: 'Donation details need correction.',
      },
    },
  })
  @Patch('reject/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async rejectDonation(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: RejectDonationDto,
  ): Promise<string> {
    return await this.donationsService.rejectDonation(id, data);
  }

  @Patch('deliver/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deliverDonation(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<string> {
    return await this.donationsService.deliverDonation(id);
  }
}
