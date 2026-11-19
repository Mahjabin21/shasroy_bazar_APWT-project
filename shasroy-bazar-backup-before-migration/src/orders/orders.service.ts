
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { randomInt } from 'crypto';

import { OrderEntity } from './entities/order.entity.js';
import { OrderItemEntity } from './entities/order-item.entity.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto.js';

import { ServiceZone } from '../service-zones/entities/service-zone.entity.js';
import { MerchantZone } from '../merchant-zones/entities/merchant-zone.entity.js';
import { DeliveryEntity } from '../delivery/entities/delivery.entity.js';
import { Notification } from '../notification/entities/notification.entity.js';
import { User } from '../users/entities/user.entity.js';
import { PurchaseLimitsService } from '../purchase-limits/purchase-limits.service.js';

import {
  Product,
  ProductListingStatus,
} from '../products/entities/product.entity.js';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,

    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepo: Repository<OrderItemEntity>,

    private readonly dataSource: DataSource,

    private readonly purchaseLimitsService: PurchaseLimitsService,
  ) {}

  // 1. Place a new order
  async placeOrder(userId: number, dto: CreateOrderDto): Promise<OrderEntity> {
    const fulfillmentType = dto.fulfillment_type ?? 'pickup';

    if (fulfillmentType === 'delivery' && !dto.delivery_address) {
      throw new BadRequestException(
        'delivery_address is required for delivery orders',
      );
    }

    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('At least one order item is required');
    }

    // FR-34: Check purchase limits before placing the order
    await this.purchaseLimitsService.checkPurchaseLimits(userId, dto.items);

    const savedOrderResult = await this.dataSource.transaction(async (manager) => {
      const productRepo = manager.getRepository(Product);
      const orderRepo = manager.getRepository(OrderEntity);
      const itemRepo = manager.getRepository(OrderItemEntity);

      const zone = await manager.getRepository(ServiceZone).findOne({
        where: { zoneId: dto.zone_id },
      });

      if (!zone) {
        throw new NotFoundException(`Service zone ${dto.zone_id} not found`);
      }

      if (zone.zoneStatus !== 'active') {
        throw new BadRequestException('This service zone is inactive');
      }

      const merchantZoneRepo = manager.getRepository(MerchantZone);

      let totalPaisa = 0;

      const reservedItems: Array<{
        product: Product;
        quantity: number;
        price: number;
      }> = [];

      // Validate products and reserve stock
      for (const item of dto.items) {
        if (!Number.isInteger(item.quantity) || item.quantity < 1) {
          throw new BadRequestException(
            'Quantity must be a positive integer',
          );
        }

        const product = await productRepo.findOne({
          where: { listingId: item.listing_id },
          lock: { mode: 'pessimistic_write' },
        });

        if (
          !product ||
          product.listingStatus !== ProductListingStatus.ACTIVE
        ) {
          throw new NotFoundException(
            `Active product ${item.listing_id} not found`,
          );
        }

        const today = new Date().toISOString().slice(0, 10);

        if (product.expiryDate < today) {
          throw new BadRequestException(
            `${product.productName} has expired and cannot be ordered`,
          );
        }

        // FR-07: Check merchant's service zone
        const sellsInZone = await merchantZoneRepo.findOne({
          where: {
            merchantId: product.merchantId,
            zoneId: dto.zone_id,
          },
        });

        if (!sellsInZone) {
          throw new BadRequestException(
            `${product.productName} is not available in the selected zone`,
          );
        }

        const availableStock = Number(product.quantityAvailable);

        if (availableStock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for ${product.productName}. Available: ${availableStock}`,
          );
        }

        // Use database price
        const price = Number(product.systemPrice);

        if (!Number.isFinite(price) || price < 0) {
          throw new BadRequestException(
            `Invalid price for ${product.productName}`,
          );
        }

        totalPaisa += Math.round(price * 100) * item.quantity;

        // Reserve stock
        product.quantityAvailable = availableStock - item.quantity;
        await productRepo.save(product);

        reservedItems.push({
          product,
          quantity: item.quantity,
          price,
        });
      }

      // Generate pickup details
      const pickupCode =
        fulfillmentType === 'pickup'
          ? String(randomInt(100000, 1000000))
          : null;

      const reservationExpiresAt =
        fulfillmentType === 'pickup'
          ? new Date(Date.now() + 2 * 60 * 60 * 1000)
          : null;

      // Create order
      const order = orderRepo.create({
        order_status: 'Pending Payment',
        fulfillment_type: fulfillmentType,
        pickup_code: pickupCode,
        reservation_expires_at: reservationExpiresAt,
        total_amount: (totalPaisa / 100).toFixed(2),
        user_id: userId,
        zone_id: dto.zone_id,
        delivery_address: dto.delivery_address ?? null,
        recipient_phone: dto.recipient_phone ?? null,
      });

      const savedOrder = await orderRepo.save(order);

      // Create order items
      const orderItems = reservedItems.map((item) =>
        itemRepo.create({
          order_id: savedOrder.order_id,
          listing_id: item.product.listingId,
          quantity: item.quantity,
          unit_price: item.price.toFixed(2),
        }),
      );

      await itemRepo.save(orderItems);

      // Create delivery record for delivery orders
      if (fulfillmentType === 'delivery') {
        const deliveryRepo = manager.getRepository(DeliveryEntity);

        await deliveryRepo.save(
          deliveryRepo.create({
            order_id: savedOrder.order_id,
            delivery_address: dto.delivery_address as string,
            recipient_phone: dto.recipient_phone ?? null,
            delivery_status: 'Pending',
          }),
        );
      }

      // FR-71: Notify customer that order was placed
      const notificationRepo = manager.getRepository(Notification);

      await notificationRepo.save(
        notificationRepo.create({
          type: 'ORDER_PLACED',
          message:
            `Your order #${savedOrder.order_id} was placed. ` +
            `Total: ${savedOrder.total_amount} BDT. Please complete payment.`,
          user: { userId } as User,
          relatedOrderId: savedOrder.order_id,
        }),
      );

      return orderRepo.findOneOrFail({
        where: { order_id: savedOrder.order_id },
        relations: { items: true },
      });
    });

    // Record purchase quantities after order creation
    await this.purchaseLimitsService.recordPurchases(userId, dto.items);

    return savedOrderResult;
  }

  // 2. Get all orders
  async getAllOrders(): Promise<OrderEntity[]> {
    return this.orderRepo.find({
      relations: { items: true },
      order: { order_id: 'DESC' },
    });
  }

  // 3. Get orders belonging to a user
  async getOrdersByUser(userId: number): Promise<OrderEntity[]> {
    return this.orderRepo.find({
      where: { user_id: userId },
      relations: { items: true },
      order: { order_id: 'DESC' },
    });
  }

  // 4. Get a single order by ID
  async getOrderById(
    id: number,
    requester?: { role: string; userId?: number },
  ): Promise<OrderEntity> {
    const order = await this.orderRepo.findOne({
      where: { order_id: id },
      relations: { items: true },
    });

    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    if (requester?.role === 'user' && order.user_id !== requester.userId) {
      throw new ForbiddenException('You can only view your own orders');
    }

    return order;
  }

  // 5. Update order status
  async updateOrderStatus(
    id: number,
    dto: UpdateOrderStatusDto,
  ): Promise<string> {
    return this.dataSource.transaction(async (manager) => {
      const orderRepo = manager.getRepository(OrderEntity);

      const order = await orderRepo.findOne({
        where: { order_id: id },
        lock: { mode: 'pessimistic_write' },
      });

      if (order) {
        order.items = await manager.getRepository(OrderItemEntity).find({
          where: { order_id: id },
        });
      }

      if (!order) {
        throw new NotFoundException(`Order with id ${id} not found`);
      }

      // Prevent changes to final orders
      const finalStatuses = [
        'Cancelled',
        'Delivered',
        'Picked Up',
        'No Show',
      ];

      if (finalStatuses.includes(order.order_status)) {
        throw new BadRequestException(
          `Order ${id} is already ${order.order_status}`,
        );
      }

      // Pickup orders require handover confirmation
      if (
        order.fulfillment_type === 'pickup' &&
        dto.order_status === 'Delivered'
      ) {
        throw new BadRequestException(
          'Pickup orders must be completed through pickup handover confirmation',
        );
      }

      if (
        (dto.order_status === 'Picked Up' || dto.order_status === 'No Show') &&
        order.fulfillment_type !== 'pickup'
      ) {
        throw new BadRequestException(
          `${dto.order_status} is only valid for pickup orders`,
        );
      }

      if (
        dto.order_status === 'Picked Up' &&
        order.order_status === 'Pending Payment'
      ) {
        throw new BadRequestException(
          'An unpaid order cannot be marked as Picked Up',
        );
      }

      // Restore stock for cancelled and no-show orders
      if (dto.order_status === 'Cancelled' || dto.order_status === 'No Show') {
        const productRepo = manager.getRepository(Product);

        for (const item of order.items ?? []) {
          if (!item.listing_id) {
            continue;
          }

          const product = await productRepo.findOne({
            where: { listingId: item.listing_id },
            lock: { mode: 'pessimistic_write' },
          });

          if (product) {
            const currentStock = Number(product.quantityAvailable);
            product.quantityAvailable = currentStock + item.quantity;
            await productRepo.save(product);
          }
        }

        order.pickup_code = null;

        if (dto.order_status === 'No Show') {
          order.no_show_at = new Date();
        }
      }

      if (dto.order_status === 'Picked Up') {
        order.merchant_handover_at = new Date();
      }

      order.order_status = dto.order_status;
      await orderRepo.save(order);

      // Notify customer about order status update
      const notificationRepo = manager.getRepository(Notification);

      await notificationRepo.save(
        notificationRepo.create({
          type: 'ORDER_STATUS',
          message: `Your order #${id} is now ${dto.order_status}.`,
          user: { userId: order.user_id } as User,
          relatedOrderId: id,
        }),
      );

      return `Order status updated to ${dto.order_status} for order ${id}`;
    });
  }
}
