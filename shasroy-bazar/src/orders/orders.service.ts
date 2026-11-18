import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { randomUUID } from 'node:crypto';
import { PaymentEntity } from './entities/payment.entity.js';
import { OrderEntity } from '../orders/entities/order.entity.js';
import { SimulatePaymentDto } from './dto/simulate-payment.dto.js';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,

    private readonly dataSource: DataSource,
  ) {}

  // SIMULATE PAYMENT
  async simulatePayment(
    orderId: number,
    userId: number,
    dto: SimulatePaymentDto,
  ) {
    return this.dataSource.transaction(async (manager) => {
      const orderRepository = manager.getRepository(OrderEntity);
      const paymentRepository = manager.getRepository(PaymentEntity);

      // Check whether this request was already processed.
      // A retry must use the same idempotency reference.
      const previousPayment = await paymentRepository.findOne({
        where: {
          idempotency_ref: dto.idempotency_ref,
        },
        relations: {
          order: true,
        },
      });

      if (previousPayment) {
        if (
          previousPayment.order_id !== orderId ||
          previousPayment.order.user_id !== userId
        ) {
          throw new ConflictException(
            'This idempotency reference has already been used',
          );
        }

        return {
          message:
            previousPayment.payment_status === 'Success'
              ? 'Payment successful'
              : 'Payment failed. You may try again.',
          payment: {
            payment_id: previousPayment.payment_id,
            order_id: previousPayment.order_id,
            amount: previousPayment.amount,
            payment_method: previousPayment.payment_method,
            payment_status: previousPayment.payment_status,
            provider_txn_id: previousPayment.provider_txn_id,
            initiated_at: previousPayment.initiated_at,
            confirmed_at: previousPayment.confirmed_at,
          },
          order_status: previousPayment.order.order_status,
        };
      }

      // Find and lock the order
      const order = await orderRepository.findOne({
        where: {
          order_id: orderId,
          user_id: userId,
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      // Only pending-payment orders can be paid
      if (order.order_status !== 'Pending Payment') {
        throw new ConflictException(
          `Payment cannot be made for an order with status: ${order.order_status}`,
        );
      }

      // Check whether this order already has a successful payment
      const existingPayment = await paymentRepository.findOne({
        where: {
          order_id: orderId,
          payment_status: 'Success',
        },
      });

      if (existingPayment) {
        throw new ConflictException(
          'This order has already been paid',
        );
      }

      // Always use the amount stored in the order
      const amount = order.total_amount;

      if (Number(amount) <= 0) {
        throw new BadRequestException('Invalid order amount');
      }

      // Generate a simulated provider transaction ID
      const providerTxnId = `SIM-${randomUUID()}`;

      // Determine simulated result
      const paymentStatus =
        dto.simulation_result === 'success'
          ? 'Success'
          : 'Failed';

      // Create payment record
      const payment = paymentRepository.create({
        order_id: orderId,
        order: order,
        amount: amount,
        payment_method: dto.payment_method,
        payment_status: paymentStatus,
        provider_txn_id: providerTxnId,
        idempotency_ref: dto.idempotency_ref,
        confirmed_at:
          paymentStatus === 'Success' ? new Date() : null,
      });

      const savedPayment = await paymentRepository.save(payment);

      // Update order only when payment succeeds
      if (paymentStatus === 'Success') {
        order.order_status = 'Confirmed';
        await orderRepository.save(order);
      }

      return {
        message:
          paymentStatus === 'Success'
            ? 'Payment successful'
            : 'Payment failed. You may try again.',
        payment: {
          payment_id: savedPayment.payment_id,
          order_id: savedPayment.order_id,
          amount: savedPayment.amount,
          payment_method: savedPayment.payment_method,
          payment_status: savedPayment.payment_status,
          provider_txn_id: savedPayment.provider_txn_id,
          initiated_at: savedPayment.initiated_at,
          confirmed_at: savedPayment.confirmed_at,
        },
        order_status: order.order_status,
      };
    });
  }

  // GET ALL PAYMENTS BELONGING TO A CUSTOMER
  async getMyPayments(userId: number) {
    const payments = await this.paymentRepository
      .createQueryBuilder('payment')
      .innerJoin('payment.order', 'order')
      .where('order.user_id = :userId', { userId })
      .orderBy('payment.initiated_at', 'DESC')
      .getMany();

    return {
      message: 'Payment history retrieved successfully',
      total: payments.length,
      payments,
    };
  }

  // GET PAYMENTS FOR A PARTICULAR CUSTOMER ORDER
  async getPaymentsByOrder(
    orderId: number,
    userId: number,
  ) {
    // Verify that the order belongs to the customer
    const order = await this.dataSource
      .getRepository(OrderEntity)
      .findOne({
        where: {
          order_id: orderId,
          user_id: userId,
        },
      });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const payments = await this.paymentRepository.find({
      where: {
        order_id: orderId,
      },
      order: {
        initiated_at: 'DESC',
      },
    });

    return {
      message: 'Order payment history retrieved successfully',
      order_id: orderId,
      total: payments.length,
      payments,
    };
  }
}
