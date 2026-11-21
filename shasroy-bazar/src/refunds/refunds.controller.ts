
<<<<<<< HEAD
import { ApiBody,ApiBearerAuth } from '@nestjs/swagger';
import {
  Body,
  Controller,
  ForbiddenException,
=======
import { ApiBody } from '@nestjs/swagger';
import {
  Body,
  Controller,
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
<<<<<<< HEAD
  Req,
  UseGuards,
} from '@nestjs/common';

=======
  UseGuards,
} from '@nestjs/common';
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
import { RefundsService } from './refunds.service.js';
import { RefundEntity } from './entities/refund.entity.js';
import { CreateRefundDto } from './dto/create-refund.dto.js';
import { ProcessRefundDto } from './dto/process-refund.dto.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
<<<<<<< HEAD
import { Roles } from '../common/decorators/roles.decorator.js';

@Controller('refunds')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RefundsController {
  constructor(private readonly refundsService: RefundsService) {}

  // CUSTOMER: Request refund for own order
  @Post('request-refund')
  @Roles('user')
=======

@Controller('refunds')
export class RefundsController {
  constructor(private readonly refundsService: RefundsService) {}

>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
  @ApiBody({
    schema: {
      example: {
        order_id: 1,
<<<<<<< HEAD
=======
        user_id: 1,
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
        reason: 'Order was not delivered as expected.',
      },
    },
  })
<<<<<<< HEAD
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
=======
  @Post('request-refund')
  async requestRefund(@Body() dto: CreateRefundDto): Promise<RefundEntity> {
    return await this.refundsService.requestRefund(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
  async getAllRefunds(): Promise<RefundEntity[]> {
    return await this.refundsService.getAllRefunds();
  }

<<<<<<< HEAD
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
=======
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
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
  @ApiBody({
    schema: {
      example: {
        admin_note: 'Refund reviewed and approved.',
      },
    },
  })
<<<<<<< HEAD
=======
  @Patch('approve/:id')
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
  async approveRefund(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ProcessRefundDto,
  ): Promise<string> {
    return await this.refundsService.approveRefund(id, dto);
  }

<<<<<<< HEAD
  // ADMIN: Reject refund
  @Patch('reject/:id')
  @Roles('admin')
=======
  @UseGuards(JwtAuthGuard, RolesGuard)
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
  @ApiBody({
    schema: {
      example: {
        admin_note: 'Refund request does not meet the policy requirements.',
      },
    },
  })
<<<<<<< HEAD
=======
  @Patch('reject/:id')
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
  async rejectRefund(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ProcessRefundDto,
  ): Promise<string> {
    return await this.refundsService.rejectRefund(id, dto);
  }

<<<<<<< HEAD
  // ADMIN: Complete approved refund
  @Patch('complete/:id')
  @Roles('admin')
=======
  @UseGuards(JwtAuthGuard, RolesGuard)
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
  @ApiBody({
    schema: {
      example: {
        admin_note: 'Refund has been processed successfully.',
      },
    },
  })
<<<<<<< HEAD
=======
  @Patch('complete/:id')
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
  async completeRefund(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ProcessRefundDto,
  ): Promise<string> {
    return await this.refundsService.completeRefund(id, dto);
  }
}
