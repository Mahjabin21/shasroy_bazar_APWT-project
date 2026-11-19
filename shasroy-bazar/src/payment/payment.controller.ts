
import {
  Controller,
  Post,
  Get,
  Param,
  ParseIntPipe,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';

import { PaymentsService } from './payment.service.js';
import { SimulatePaymentDto } from './dto/simulate-payment.dto.js';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';

type AuthenticatedRequest = Request & {
  user: {
    userId: number;
    role: string;
  };
};

@ApiTags('Payments')
@ApiBearerAuth('JWT-auth')
@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('user')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
  ) {}

  // Simulate payment for an order
  @Post('orders/:orderId/simulate')
  simulatePayment(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Req() req: AuthenticatedRequest,
    @Body() dto: SimulatePaymentDto,
  ) {
    return this.paymentsService.simulatePayment(
      orderId,
      req.user.userId,
      dto,
    );
  }

  // Get payment history of logged-in customer
  @Get('my-payments')
  getMyPayments(
    @Req() req: AuthenticatedRequest,
  ) {
    return this.paymentsService.getMyPayments(
      req.user.userId,
    );
  }

  // Get payment history for a specific order
  @Get('orders/:orderId')
  getPaymentsByOrder(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.paymentsService.getPaymentsByOrder(
      orderId,
      req.user.userId,
    );
  }
}
