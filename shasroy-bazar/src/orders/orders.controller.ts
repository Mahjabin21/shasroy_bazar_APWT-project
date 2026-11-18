
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

import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { OrdersService } from './orders.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto.js';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
  ) {}

  // Customer: Place a new order
  @Post('place-order')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @ApiOperation({ summary: 'Place an order' })
  placeOrder(
    @Req() req: any,
    @Body() dto: CreateOrderDto,
  ) {
    return this.ordersService.placeOrder(
      dto,
      req.user.userId,
    );
  }

  // Admin: Get all orders
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  // Customer: Get their own orders
  @Get('my-orders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  getMyOrders(@Req() req: any) {
    return this.ordersService.getOrdersByUser(
      req.user.userId,
    );
  }

  // Admin: Update order status
  @Patch('update-status/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(
      id,
      dto,
    );
  }

  // Customer: Get a specific order they own
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  getOrderById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    return this.ordersService.getOrderByIdForUser(
      id,
      req.user.userId,
    );
  }
}
