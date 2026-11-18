import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from './entities/order.entity.js';
import { OrderItemEntity } from './entities/order-item.entity.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto.js';
import { PurchaseLimitsService } from '../purchase-limits/purchase-limits.service.js';
import { DeliveryService } from '../delivery/delivery.service.js';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepo: Repository<OrderItemEntity>,
    private readonly purchaseLimitsService: PurchaseLimitsService,
    private readonly deliveryService: DeliveryService,
  ) {}

  async placeOrder(dto: CreateOrderDto): Promise<OrderEntity> {
    const fulfillmentType = dto.fulfillment_type ?? 'delivery';
    if (fulfillmentType === 'delivery' && !dto.delivery_address) {
      throw new BadRequestException(
        'delivery_address is required for delivery orders',
      );
    }

    await this.purchaseLimitsService.checkPurchaseLimits(
      dto.user_id,
      dto.items,
    );

    // Work in paisa to avoid floating point rounding errors
    let totalPaisa = 0;
    for (const item of dto.items) {
      totalPaisa += Math.round(item.unit_price * 100) * item.quantity;
    }

    const order = this.orderRepo.create({
      order_status: 'Pending',
      fulfillment_type: fulfillmentType,
      total_amount: (totalPaisa / 100).toFixed(2),
      user_id: dto.user_id,
      zone_id: dto.zone_id,
    });
    const savedOrder = await this.orderRepo.save(order);

    const orderItems = dto.items.map((item) =>
      this.orderItemRepo.create({
        order_id: savedOrder.order_id,
        listing_id: item.listing_id,
        quantity: item.quantity,
        unit_price: item.unit_price.toFixed(2),
      }),
    );
    await this.orderItemRepo.save(orderItems);

    await this.purchaseLimitsService.recordPurchases(dto.user_id, dto.items);

    if (fulfillmentType === 'delivery' && dto.delivery_address) {
      await this.deliveryService.createDelivery(
        savedOrder.order_id,
        dto.delivery_address,
        dto.recipient_phone,
      );
    }

    return await this.getOrderById(savedOrder.order_id);
  }

  async getAllOrders(): Promise<OrderEntity[]> {
    return await this.orderRepo.find({
      relations: { items: true },
      order: { order_id: 'DESC' },
    });
  }

  async getOrdersByUser(userId: number): Promise<OrderEntity[]> {
    return await this.orderRepo.find({
      where: { user_id: userId },
      relations: { items: true },
      order: { order_id: 'DESC' },
    });
  }

  async getOrderById(id: number): Promise<OrderEntity> {
    const order = await this.orderRepo.findOne({
      where: { order_id: id },
      relations: { items: true },
    });
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    return order;
  }

  async updateOrderStatus(
    id: number,
    dto: UpdateOrderStatusDto,
  ): Promise<string> {
    const order = await this.getOrderById(id);
    if (
      order.order_status === 'Cancelled' ||
      order.order_status === 'Delivered'
    ) {
      throw new BadRequestException(
        `Order ${id} is already ${order.order_status}, status cannot be changed`,
      );
    }

    await this.orderRepo.update(id, { order_status: dto.order_status });
    return `Order status updated to ${dto.order_status} for order ${id}`;
  }
}
