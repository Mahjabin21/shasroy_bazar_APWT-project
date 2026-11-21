import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { DeliveryService } from './delivery.service.js';
import { DeliveryEntity } from './entities/delivery.entity.js';

import { UpdateDeliveryStatusDto } from './dto/update-delivery-status.dto.js';
import { UpdateDeliveryAddressDto } from './dto/update-delivery-address.dto.js';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';

@Controller('delivery')
@ApiBearerAuth('JWT-auth')
export class DeliveryController {
  constructor(
    private readonly deliveryService: DeliveryService,
  ) {}

  // GET /delivery
  // Get all deliveries
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async getAllDeliveries(): Promise<DeliveryEntity[]> {
    return await this.deliveryService.getAllDeliveries();
  }

  // GET /delivery/order/:orderId
  // Get delivery details for an order
  @Get('order/:orderId')
  async getDeliveryByOrder(
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<DeliveryEntity> {
    return await this.deliveryService.getDeliveryByOrder(orderId);
  }

  // PATCH /delivery/update-status/:orderId
  // Update delivery status
  @ApiBearerAuth('JWT-auth')
  @ApiBody({
    schema: {
      example: {
        delivery_status: 'Shipped',
      },
    },
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('update-status/:orderId')
  async updateDeliveryStatus(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() dto: UpdateDeliveryStatusDto,
  ): Promise<string> {
    return await this.deliveryService.updateDeliveryStatus(
      orderId,
      dto,
    );
  }

  // PATCH /delivery/update-address/:orderId
  // Update delivery address
  @ApiBody({
    schema: {
      example: {
        delivery_address: 'House 10, Road 2, Dhaka',
        recipient_phone: '01712345678',
      },
    },
  })
  @Patch('update-address/:orderId')
  async updateDeliveryAddress(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() dto: UpdateDeliveryAddressDto,
  ): Promise<string> {
    return await this.deliveryService.updateDeliveryAddress(
      orderId,
      dto,
    );
  }
}
