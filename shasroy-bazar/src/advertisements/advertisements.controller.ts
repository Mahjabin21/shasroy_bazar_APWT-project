
import { ApiBody } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
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
import { Advertisement } from './entities/advertisement.entity.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@Controller('advertisements')
export class AdvertisementsController {
  constructor(private readonly advertisementsService: AdvertisementsService) {}

  @ApiBody({
    schema: {
      example: {
        campaign_name: 'Winter Food Campaign',
        content_url: 'https://example.com/test/campaign.jpg',
        start_date: '2026-11-20',
        end_date: '2026-12-20',
        budget: 5000,
        org_id: 1,
      },
    },
  })
  @Post('create-advertisement')
  @UseGuards(JwtAuthGuard, RolesGuard)
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
  async getAdvertisementById(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.advertisementsService.getAdvertisementById(id);
  }

  @ApiBody({
    schema: {
      example: {
        campaign_name: 'Winter Food Campaign Updated',
        content_url: 'https://example.com/test/campaign-new.jpg',
        start_date: '2026-11-21',
        end_date: '2026-12-21',
        budget: 5500,
        org_id: 1,
      },
    },
  })
  @Patch('update-advertisement/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateAdvertisement(
    @Param('id', ParseIntPipe) id: number,
    @Body() ad: UpdateAdvertisementDto,
  ){
    return await this.advertisementsService.updateAdvertisement(id, ad);
  }

  @Patch('approve-advertisement/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async approveAdvertisement(
    @Param('id', ParseIntPipe) id: number,
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
  }
}
