import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto.js';
import { OrderEntity } from './entities/order.entity.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('place-order')
  async placeOrder(@Body() dto: CreateOrderDto): Promise<OrderEntity> {
    return await this.ordersService.placeOrder(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async getAllOrders(): Promise<OrderEntity[]> {
    return await this.ordersService.getAllOrders();
  }

  @Get('user/:userId')
  async getOrdersByUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<OrderEntity[]> {
    return await this.ordersService.getOrdersByUser(userId);
  }

  @Get(':id')
  async getOrderById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OrderEntity> {
    return await this.ordersService.getOrderById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('update-status/:id')
  async updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
  ): Promise<string> {
    return await this.ordersService.updateOrderStatus(id, dto);
  }
}
