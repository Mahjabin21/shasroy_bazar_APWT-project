
import { ApiBody } from '@nestjs/swagger';
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
import { RefundsService } from './refunds.service.js';
import { RefundEntity } from './entities/refund.entity.js';
import { CreateRefundDto } from './dto/create-refund.dto.js';
import { ProcessRefundDto } from './dto/process-refund.dto.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';

@Controller('refunds')
export class RefundsController {
  constructor(private readonly refundsService: RefundsService) {}

  @ApiBody({
    schema: {
      example: {
        order_id: 1,
        user_id: 1,
        reason: 'Order was not delivered as expected.',
      },
    },
  })
  @Post('request-refund')
  async requestRefund(@Body() dto: CreateRefundDto): Promise<RefundEntity> {
    return await this.refundsService.requestRefund(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async getAllRefunds(): Promise<RefundEntity[]> {
    return await this.refundsService.getAllRefunds();
  }

  @Get('user/:userId')
  async getRefundsByUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<RefundEntity[]> {
    return await this.refundsService.getRefundsByUser(userId);
  }

  @Get(':id')
  async getRefundById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<RefundEntity> {
    return await this.refundsService.getRefundById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBody({
    schema: {
      example: {
        admin_note: 'Refund reviewed and approved.',
      },
    },
  })
  @Patch('approve/:id')
  async approveRefund(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ProcessRefundDto,
  ): Promise<string> {
    return await this.refundsService.approveRefund(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBody({
    schema: {
      example: {
        admin_note: 'Refund request does not meet the policy requirements.',
      },
    },
  })
  @Patch('reject/:id')
  async rejectRefund(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ProcessRefundDto,
  ): Promise<string> {
    return await this.refundsService.rejectRefund(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBody({
    schema: {
      example: {
        admin_note: 'Refund has been processed successfully.',
      },
    },
  })
  @Patch('complete/:id')
  async completeRefund(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ProcessRefundDto,
  ): Promise<string> {
    return await this.refundsService.completeRefund(id, dto);
  }
}
