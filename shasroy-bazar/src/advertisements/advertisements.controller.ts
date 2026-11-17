import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { AdvertisementsService } from './advertisements.service.js';
import { CreateAdvertisementDto } from './dto/create-advertisement.dto.js';
import { UpdateAdvertisementDto } from './dto/update-advertisement.dto.js';
import { Advertisement } from './entities/advertisement.entity.js';

@Controller('advertisements')
export class AdvertisementsController {
  constructor(private readonly advertisementsService: AdvertisementsService) {}

  @Post('create-advertisement')
  async createAdvertisement(
    @Body() ad: CreateAdvertisementDto,
  ): Promise<Advertisement> {
    return await this.advertisementsService.createAdvertisement(ad);
  }

  @Get()
  async getAllAdvertisements(): Promise<Advertisement[]> {
    return await this.advertisementsService.getAllAdvertisements();
  }

  @Get(':id')
  async getAdvertisementById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Advertisement> {
    return await this.advertisementsService.getAdvertisementById(id);
  }

  @Patch('update-advertisement/:id')
  async updateAdvertisement(
    @Param('id', ParseIntPipe) id: number,
    @Body() ad: UpdateAdvertisementDto,
  ): Promise<string> {
    return await this.advertisementsService.updateAdvertisement(id, ad);
  }

  @Patch('approve-advertisement/:id')
  async approveAdvertisement(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<string> {
    return await this.advertisementsService.approveAdvertisement(id);
  }

  @Delete(':id')
  async deleteAdvertisement(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<string> {
    return await this.advertisementsService.deleteAdvertisement(id);
  }
}