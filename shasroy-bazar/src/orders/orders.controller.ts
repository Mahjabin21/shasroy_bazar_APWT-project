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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@ApiTags('Orders')
@ApiBearerAuth('JWT-auth')
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // The customer is taken from the login token, never from the request body.
  @Post('place-order')
  @Roles('user')
  @ApiOperation({ summary: 'Place an order and reserve product stock (user)' })
  placeOrder(@Req() req: any, @Body() dto: CreateOrderDto) {
    return this.ordersService.placeOrder(req.user.userId, dto);
  }

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'List all orders (admin)' })
  getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  @Get('my')
  @Roles('user')
  @ApiOperation({ summary: 'List my orders (user)' })
  getMyOrders(@Req() req: any) {
    return this.ordersService.getOrdersByUser(req.user.userId);
  }

  @Get('user/:userId')
  @Roles('admin')
  @ApiOperation({ summary: 'List orders of one user (admin)' })
  getOrdersByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.ordersService.getOrdersByUser(userId);
  }

  @Patch('update-status/:id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update order status (admin)' })
  updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(id, dto);
  }

  @Get(':id')
  @Roles('user', 'admin')
  @ApiOperation({ summary: 'Get one order (owner or admin)' })
  getOrderById(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.ordersService.getOrderById(id, req.user);
  }
}
