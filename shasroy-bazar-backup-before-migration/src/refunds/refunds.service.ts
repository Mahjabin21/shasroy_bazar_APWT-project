import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { RefundEntity } from './entities/refund.entity.js';
import { OrderEntity } from '../orders/entities/order.entity.js';
import { CreateRefundDto } from './dto/create-refund.dto.js';
import { ProcessRefundDto } from './dto/process-refund.dto.js';

@Injectable()
export class RefundsService {
  constructor(
    @InjectRepository(RefundEntity)
    private readonly refundRepo: Repository<RefundEntity>,
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
  ) {}

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
        refund_status: In(['Pending', 'Approved', 'Completed']),
      },
    });
    if (activeRefund) {
      throw new BadRequestException(
        `A refund request already exists for order ${dto.order_id}`,
      );
    }

    const refund = this.refundRepo.create({
      order_id: dto.order_id,
      user_id: dto.user_id,
      reason: dto.reason,
      refund_amount: order.total_amount,
      refund_status: 'Pending',
    });
    return await this.refundRepo.save(refund);
  }

  async getAllRefunds(): Promise<RefundEntity[]> {
    return await this.refundRepo.find({
      order: { refund_id: 'DESC' },
    });
  }

  async getRefundsByUser(userId: number): Promise<RefundEntity[]> {
    return await this.refundRepo.find({
      where: { user_id: userId },
      order: { refund_id: 'DESC' },
    });
  }

  async getRefundById(id: number): Promise<RefundEntity> {
    const refund = await this.refundRepo.findOne({
      where: { refund_id: id },
    });
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
    return await this.changeStatus(
      id,
      'Approved',
      'Completed',
      dto.admin_note,
    );
  }

  private async changeStatus(
    id: number,
    requiredStatus: string,
    newStatus: string,
    adminNote?: string,
  ): Promise<string> {
    const refund = await this.getRefundById(id);
    if (refund.refund_status !== requiredStatus) {
      throw new BadRequestException(
        `Refund ${id} is ${refund.refund_status}, only ${requiredStatus} refunds can be marked ${newStatus}`,
      );
    }

    refund.refund_status = newStatus;
    refund.processed_at = new Date();
    if (adminNote) {
      refund.admin_note = adminNote;
    }
    await this.refundRepo.save(refund);
    return `Refund ${id} marked as ${newStatus}`;
  }
}
