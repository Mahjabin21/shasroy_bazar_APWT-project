

import {
  BadRequestException,
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
  ) {}

  // 1. Place a new order
  async placeOrder(
    dto: CreateOrderDto,
    userId: number,
  ): Promise<OrderEntity> {
    const fulfillmentType = dto.fulfillment_type ?? 'pickup';

    // Validate order details
    if (
      fulfillmentType === 'delivery' &&
      !dto.delivery_address
    ) {
      throw new BadRequestException(
        'delivery_address is required for delivery orders',
      );
    }

    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException(
        'At least one order item is required',
      );
    }

    return this.dataSource.transaction(async (manager) => {
      const productRepo = manager.getRepository(Product);
      const orderRepo = manager.getRepository(OrderEntity);
      const itemRepo = manager.getRepository(OrderItemEntity);

      let totalPaisa = 0;

      const reservedItems: Array<{
        product: Product;
        quantity: number;
        price: number;
      }> = [];

      // Check every product and reserve its stock
      for (const item of dto.items) {
        if (
          !Number.isInteger(item.quantity) ||
          item.quantity < 1
        ) {
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

        // Check product expiry
        const today = new Date().toISOString().slice(0, 10);

        if (product.expiryDate < today) {
          throw new BadRequestException(
            `${product.productName} has expired and cannot be ordered`,
          );
        }

        // Check available stock
        const availableStock = Number(
          product.quantityAvailable,
        );

        if (availableStock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for ${product.productName}. Available: ${availableStock}`,
          );
        }

        // Use the price stored in the database
        const price = Number(product.systemPrice);

        if (!Number.isFinite(price) || price < 0) {
          throw new BadRequestException(
            `Invalid price for ${product.productName}`,
          );
        }

        // Calculate total in paisa
        totalPaisa +=
          Math.round(price * 100) * item.quantity;

        // Reserve product stock
        product.quantityAvailable =
          availableStock - item.quantity;

        await productRepo.save(product);

        reservedItems.push({
          product,
          quantity: item.quantity,
          price,
        });
      }

      // Generate pickup details if required
      const pickupCode =
        fulfillmentType === 'pickup'
          ? String(randomInt(100000, 1000000))
          : null;

      const reservationExpiresAt =
        fulfillmentType === 'pickup'
          ? new Date(Date.now() + 2 * 60 * 60 * 1000)
          : null;

      // Create the order
      const order = orderRepo.create({
        order_status: 'Pending Payment',
        fulfillment_type: fulfillmentType,
        pickup_code: pickupCode,
        reservation_expires_at: reservationExpiresAt,
        total_amount: (totalPaisa / 100).toFixed(2),

        // Get user ID from authenticated JWT
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

      // Return order with items
      return orderRepo.findOneOrFail({
        where: { order_id: savedOrder.order_id },
        relations: { items: true },
      });
    });
  }

  // 2. Get all orders (Admin)
  async getAllOrders(): Promise<OrderEntity[]> {
    return this.orderRepo.find({
      relations: { items: true },
      order: { order_id: 'DESC' },
    });
  }

  // 3. Get orders belonging to a particular user
  async getOrdersByUser(
    userId: number,
  ): Promise<OrderEntity[]> {
    return this.orderRepo.find({
      where: { user_id: userId },
      relations: { items: true },
      order: { order_id: 'DESC' },
    });
  }

  // 4. Get a single order by ID (internal/admin use)
  async getOrderById(id: number): Promise<OrderEntity> {
    const order = await this.orderRepo.findOne({
      where: { order_id: id },
      relations: { items: true },
    });

    if (!order) {
      throw new NotFoundException(
        `Order with id ${id} not found`,
      );
    }

    return order;
  }

  // 5. Get a specific order belonging to a user
  async getOrderByIdForUser(
    orderId: number,
    userId: number,
  ): Promise<OrderEntity> {
    const order = await this.orderRepo.findOne({
      where: {
        order_id: orderId,
        user_id: userId,
      },
      relations: { items: true },
    });

    if (!order) {
      throw new NotFoundException(
        `Order with id ${orderId} not found`,
      );
    }

    return order;
  }

  // 6. Update order status
  async updateOrderStatus(
    id: number,
    dto: UpdateOrderStatusDto,
  ): Promise<string> {
    return this.dataSource.transaction(async (manager) => {
      const orderRepo = manager.getRepository(OrderEntity);

      const order = await orderRepo.findOne({
        where: { order_id: id },
        relations: { items: true },
        lock: { mode: 'pessimistic_write' },
      });

      if (!order) {
        throw new NotFoundException(
          `Order with id ${id} not found`,
        );
      }

      // Prevent changes to completed or cancelled orders
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

      // Restore stock if the order is cancelled
      if (dto.order_status === 'Cancelled') {
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
            const currentStock = Number(
              product.quantityAvailable,
            );

            product.quantityAvailable =
              currentStock + item.quantity;

            await productRepo.save(product);
          }
        }

        order.pickup_code = null;
      }

      order.order_status = dto.order_status;

      await orderRepo.save(order);

      return `Order status updated to ${dto.order_status} for order ${id}`;
    });
  }
}
