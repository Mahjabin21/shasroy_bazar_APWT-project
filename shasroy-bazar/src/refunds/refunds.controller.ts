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
  @Patch('approve/:id')
  async approveRefund(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ProcessRefundDto,
  ): Promise<string> {
    return await this.refundsService.approveRefund(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('reject/:id')
  async rejectRefund(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ProcessRefundDto,
  ): Promise<string> {
    return await this.refundsService.rejectRefund(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('complete/:id')
  async completeRefund(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ProcessRefundDto,
  ): Promise<string> {
    return await this.refundsService.completeRefund(id, dto);
  }
}
