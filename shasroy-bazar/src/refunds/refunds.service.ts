<<<<<<< HEAD

=======
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
<<<<<<< HEAD

import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { RefundEntity } from './entities/refund.entity.js';
import { OrderEntity } from '../orders/entities/order.entity.js';

=======
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { RefundEntity } from './entities/refund.entity.js';
import { OrderEntity } from '../orders/entities/order.entity.js';
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
import { CreateRefundDto } from './dto/create-refund.dto.js';
import { ProcessRefundDto } from './dto/process-refund.dto.js';

@Injectable()
export class RefundsService {
  constructor(
    @InjectRepository(RefundEntity)
    private readonly refundRepo: Repository<RefundEntity>,
<<<<<<< HEAD

=======
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
  ) {}

<<<<<<< HEAD
  // CUSTOMER: Request refund
  async requestRefund(
    dto: CreateRefundDto,
    userId: number,
  ): Promise<RefundEntity> {
    const order = await this.orderRepo.findOne({
      where: { order_id: dto.order_id },
    });

    if (!order) {
      throw new NotFoundException(
        `Order with id ${dto.order_id} not found`,
      );
    }

    // Verify order ownership using authenticated user ID
    if (order.user_id !== userId) {
      throw new BadRequestException(
        'You cannot request a refund for another customer\'s order',
      );
    }

=======
  async requestRefund(dto: CreateRefundDto): Promise<RefundEntity> {
    const order = await this.orderRepo.findOne({
      where: { order_id: dto.order_id },
    });
    if (!order) {
      throw new NotFoundException(`Order with id ${dto.order_id} not found`);
    }
    if (order.user_id !== dto.user_id) {
      throw new BadRequestException(
        `Order ${dto.order_id} does not belong to user ${dto.user_id}`,
      );
    }
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
    if (
      order.order_status !== 'Delivered' &&
      order.order_status !== 'Cancelled'
    ) {
      throw new BadRequestException(
        'Refund can only be requested for Delivered or Cancelled orders',
      );
    }

    const activeRefund = await this.refundRepo.findOne({
      where: {
        order_id: dto.order_id,
<<<<<<< HEAD
        refund_status: In([
          'Pending',
          'Approved',
          'Completed',
        ]),
      },
    });

=======
        refund_status: In(['Pending', 'Approved', 'Completed']),
      },
    });
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
    if (activeRefund) {
      throw new BadRequestException(
        `A refund request already exists for order ${dto.order_id}`,
      );
    }

    const refund = this.refundRepo.create({
      order_id: dto.order_id,
<<<<<<< HEAD
      user_id: userId,
=======
      user_id: dto.user_id,
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
      reason: dto.reason,
      refund_amount: order.total_amount,
      refund_status: 'Pending',
    });
<<<<<<< HEAD

    return await this.refundRepo.save(refund);
  }

  // ADMIN: Get all refunds
=======
    return await this.refundRepo.save(refund);
  }

>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
  async getAllRefunds(): Promise<RefundEntity[]> {
    return await this.refundRepo.find({
      order: { refund_id: 'DESC' },
    });
  }

<<<<<<< HEAD
  // Get refunds belonging to a customer
  async getRefundsByUser(
    userId: number,
  ): Promise<RefundEntity[]> {
=======
  async getRefundsByUser(userId: number): Promise<RefundEntity[]> {
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
    return await this.refundRepo.find({
      where: { user_id: userId },
      order: { refund_id: 'DESC' },
    });
  }

<<<<<<< HEAD
  // Get one refund
=======
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
  async getRefundById(id: number): Promise<RefundEntity> {
    const refund = await this.refundRepo.findOne({
      where: { refund_id: id },
    });
<<<<<<< HEAD

    if (!refund) {
      throw new NotFoundException(
        `Refund with id ${id} not found`,
      );
    }

    return refund;
  }

  // ADMIN: Approve refund
  async approveRefund(
    id: number,
    dto: ProcessRefundDto,
  ): Promise<string> {
    return await this.changeStatus(
      id,
      'Pending',
      'Approved',
      dto.admin_note,
    );
  }

  // ADMIN: Reject refund
  async rejectRefund(
    id: number,
    dto: ProcessRefundDto,
  ): Promise<string> {
    return await this.changeStatus(
      id,
      'Pending',
      'Rejected',
      dto.admin_note,
    );
  }

  // ADMIN: Complete refund
  async completeRefund(
    id: number,
    dto: ProcessRefundDto,
  ): Promise<string> {
=======
    if (!refund) {
      throw new NotFoundException(`Refund with id ${id} not found`);
    }
    return refund;
  }

  async approveRefund(id: number, dto: ProcessRefundDto): Promise<string> {
    return await this.changeStatus(id, 'Pending', 'Approved', dto.admin_note);
  }

  async rejectRefund(id: number, dto: ProcessRefundDto): Promise<string> {
    return await this.changeStatus(id, 'Pending', 'Rejected', dto.admin_note);
  }

  async completeRefund(id: number, dto: ProcessRefundDto): Promise<string> {
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
    return await this.changeStatus(
      id,
      'Approved',
      'Completed',
      dto.admin_note,
    );
  }

<<<<<<< HEAD
  // Update refund status
=======
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
  private async changeStatus(
    id: number,
    requiredStatus: string,
    newStatus: string,
    adminNote?: string,
  ): Promise<string> {
    const refund = await this.getRefundById(id);
<<<<<<< HEAD

=======
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
    if (refund.refund_status !== requiredStatus) {
      throw new BadRequestException(
        `Refund ${id} is ${refund.refund_status}, only ${requiredStatus} refunds can be marked ${newStatus}`,
      );
    }

    refund.refund_status = newStatus;
    refund.processed_at = new Date();
<<<<<<< HEAD

    if (adminNote) {
      refund.admin_note = adminNote;
    }

    await this.refundRepo.save(refund);

=======
    if (adminNote) {
      refund.admin_note = adminNote;
    }
    await this.refundRepo.save(refund);
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
    return `Refund ${id} marked as ${newStatus}`;
  }
}
