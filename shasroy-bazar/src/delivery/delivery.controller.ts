import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { DeliveryService } from './delivery.service.js';
import { DeliveryEntity } from './entities/delivery.entity.js';
import { UpdateDeliveryStatusDto } from './dto/update-delivery-status.dto.js';
import { UpdateDeliveryAddressDto } from './dto/update-delivery-address.dto.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';

@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async getAllDeliveries(): Promise<DeliveryEntity[]> {
    return await this.deliveryService.getAllDeliveries();
  }

  @Get('order/:orderId')
  async getDeliveryByOrder(
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<DeliveryEntity> {
    return await this.deliveryService.getDeliveryByOrder(orderId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('update-status/:orderId')
  async updateDeliveryStatus(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() dto: UpdateDeliveryStatusDto,
  ): Promise<string> {
    return await this.deliveryService.updateDeliveryStatus(orderId, dto);
  }

  @Patch('update-address/:orderId')
  async updateDeliveryAddress(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() dto: UpdateDeliveryAddressDto,
  ): Promise<string> {
    return await this.deliveryService.updateDeliveryAddress(orderId, dto);
  }
}
