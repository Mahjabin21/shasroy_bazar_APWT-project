import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto.js';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('place-order')
  @ApiOperation({ summary: 'Place an order and reserve product stock' })
  placeOrder(@Body() dto: CreateOrderDto) { 
    return this.ordersService.placeOrder(dto);
   }

  @Get()
  getAllOrders() {
     return this.ordersService.getAllOrders(); }

  @Get('user/:userId')
  getOrdersByUser(@Param('userId', ParseIntPipe) userId: number) { 
    return this.ordersService.getOrdersByUser(userId); }


  @Patch('update-status/:id')
  updateOrderStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOrderStatusDto) { 
    return this.ordersService.updateOrderStatus(id, dto); }

  @Get(':id')
  getOrderById(@Param('id', ParseIntPipe) id: number) { return this.ordersService.getOrderById(id); }
}
