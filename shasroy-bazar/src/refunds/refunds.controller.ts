
import { ApiBody,ApiBearerAuth } from '@nestjs/swagger';
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { RefundsService } from './refunds.service.js';
import { RefundEntity } from './entities/refund.entity.js';
import { CreateRefundDto } from './dto/create-refund.dto.js';
import { ProcessRefundDto } from './dto/process-refund.dto.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@Controller('refunds')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RefundsController {
  constructor(private readonly refundsService: RefundsService) {}

  // CUSTOMER: Request refund for own order
  @Post('request-refund')
  @Roles('user')
  @ApiBody({
    schema: {
      example: {
        order_id: 1,
        reason: 'Order was not delivered as expected.',
      },
    },
  })
  async requestRefund(
    @Body() dto: CreateRefundDto,
    @Req() req: any,
  ): Promise<RefundEntity> {
    return await this.refundsService.requestRefund(
      dto,
      req.user.userId,
    );
  }

  // ADMIN: View all refund requests
  @Get()
  @Roles('admin')
  async getAllRefunds(): Promise<RefundEntity[]> {
    return await this.refundsService.getAllRefunds();
  }

  // CUSTOMER: View own refunds
  // ADMIN: View refunds belonging to any customer
  @Get('user/:userId')
  @Roles('user', 'admin')
  async getRefundsByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() req: any,
  ): Promise<RefundEntity[]> {
    if (
      req.user.role === 'user' &&
      req.user.userId !== userId
    ) {
      throw new ForbiddenException(
        'You can only view your own refund requests',
      );
    }

    return await this.refundsService.getRefundsByUser(userId);
  }

  // CUSTOMER: View own refund
  // ADMIN: View any refund
  @Get(':id')
  @Roles('user', 'admin')
  async getRefundById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ): Promise<RefundEntity> {
    const refund = await this.refundsService.getRefundById(id);

    if (
      req.user.role === 'user' &&
      req.user.userId !== refund.user_id
    ) {
      throw new ForbiddenException(
        'You can only view your own refund requests',
      );
    }

    return refund;
  }

  // ADMIN: Approve refund
  @Patch('approve/:id')
  @Roles('admin')
  @ApiBody({
    schema: {
      example: {
        admin_note: 'Refund reviewed and approved.',
      },
    },
  })
  async approveRefund(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ProcessRefundDto,
  ): Promise<string> {
    return await this.refundsService.approveRefund(id, dto);
  }

  // ADMIN: Reject refund
  @Patch('reject/:id')
  @Roles('admin')
  @ApiBody({
    schema: {
      example: {
        admin_note: 'Refund request does not meet the policy requirements.',
      },
    },
  })
  async rejectRefund(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ProcessRefundDto,
  ): Promise<string> {
    return await this.refundsService.rejectRefund(id, dto);
  }

  // ADMIN: Complete approved refund
  @Patch('complete/:id')
  @Roles('admin')
  @ApiBody({
    schema: {
      example: {
        admin_note: 'Refund has been processed successfully.',
      },
    },
  })
  async completeRefund(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ProcessRefundDto,
  ): Promise<string> {
    return await this.refundsService.completeRefund(id, dto);
  }
}
