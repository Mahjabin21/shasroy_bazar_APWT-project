
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { randomInt } from 'node:crypto';

import { OrderEntity } from './entities/order.entity.js';
import { OrderItemEntity } from './entities/order-item.entity.js';
import { Product, ProductListingStatus } from '../products/entities/product.entity.js';

import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto.js';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,

    private readonly dataSource: DataSource,
  ) {}

  // 1. Place a new order
  async placeOrder(
    dto: CreateOrderDto,
    userId: number,
  ): Promise<OrderEntity> {
    const fulfillmentType = dto.fulfillment_type ?? 'pickup';

    if (
      fulfillmentType === 'delivery' &&
      !dto.delivery_address
    ) {
      throw new BadRequestException(
        'Delivery address is required for delivery orders',
      );
    }

    if (!Number.isInteger(dto.zone_id) || dto.zone_id < 1) {
      throw new BadRequestException('Invalid service zone');
    }

    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException(
        'An order must contain at least one product',
      );
    }

    return this.dataSource.transaction(async (manager) => {
      const orderRepo = manager.getRepository(OrderEntity);
      const itemRepo = manager.getRepository(OrderItemEntity);
      const productRepo = manager.getRepository(Product);

      let totalPaisa = 0;
      const orderItems: OrderItemEntity[] = [];

      // Validate every product and reserve its stock
      for (const item of dto.items) {
        if (
          !Number.isInteger(item.quantity) ||
          item.quantity < 1
        ) {
          throw new BadRequestException(
            'Quantity must be a positive integer',
          );
        }

        // Lock the product row to prevent simultaneous stock changes
        const product = await productRepo.findOne({
          where: { listingId: item.listing_id },
          lock: { mode: 'pessimistic_write' },
        });

        if (!product) {
          throw new NotFoundException(
            `Product listing ${item.listing_id} not found`,
          );
        }

        if (product.listingStatus !== ProductListingStatus.ACTIVE) {
          throw new BadRequestException(
            `${product.productName} is not available`,
          );
        }

        // Check product expiry using Bangladesh local date
        const today = new Intl.DateTimeFormat('en-CA', {
          timeZone: 'Asia/Dhaka',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }).format(new Date());

        if (product.expiryDate < today) {
          throw new BadRequestException(
            `${product.productName} has expired`,
          );
        }

        // Check whether the product is available in the selected zone
        const productWithZones = await productRepo.findOne({
          where: { listingId: item.listing_id },
          relations: { zones: true },
        });

        const isAvailableInZone =
          productWithZones?.zones?.some(
            (zone) => zone.zoneId === dto.zone_id,
          );

        if (!isAvailableInZone) {
          throw new BadRequestException(
            `${product.productName} is not available in the selected service zone`,
          );
        }

        // Check stock
        const availableStock = Number(product.quantityAvailable);

        if (availableStock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for ${product.productName}. Available: ${availableStock}`,
          );
        }

        // Use the system-generated price, never the client-provided price
        const price = Number(product.systemPrice);

        if (!Number.isFinite(price) || price <= 0) {
          throw new BadRequestException(
            `Invalid system price for ${product.productName}`,
          );
        }

        // Calculate total in paisa
        totalPaisa += Math.round(price * 100) * item.quantity;

        // Reserve stock
        product.quantityAvailable = availableStock - item.quantity;
        await productRepo.save(product);

        // Prepare order item
        const orderItem = itemRepo.create({
          quantity: item.quantity,
          unit_price: price.toFixed(2),
          listing_id: product.listingId,
          bundle_id: null,
        });

        orderItems.push(orderItem);
      }

      // Generate pickup information
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

      // Save order items
      for (const item of orderItems) {
        item.order_id = savedOrder.order_id;
        item.order = savedOrder;
      }

      await itemRepo.save(orderItems);

      // Return the order with its items
      const completeOrder = await orderRepo.findOne({
        where: { order_id: savedOrder.order_id },
        relations: { items: true },
      });

      if (!completeOrder) {
        throw new NotFoundException('Created order could not be retrieved');
      }

      return completeOrder;
    });
  }

  // 2. Get all orders (Admin)
  async getAllOrders(): Promise<OrderEntity[]> {
    return this.orderRepository.find({
      relations: { items: true },
      order: { order_id: 'DESC' },
    });
  }

  // 3. Get orders belonging to a particular customer
  async getOrdersByUser(userId: number): Promise<OrderEntity[]> {
    return this.orderRepository.find({
      where: { user_id: userId },
      relations: { items: true },
      order: { order_id: 'DESC' },
    });
  }

  // 4. Get a single order by ID (Admin/internal use)
  async getOrderById(id: number): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({
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

  // 5. Get a specific order belonging to a customer
  async getOrderByIdForUser(
    orderId: number,
    userId: number,
  ): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({
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

  // 6. Update order status (Admin)
  async updateOrderStatus(
    id: number,
    dto: UpdateOrderStatusDto,
  ): Promise<OrderEntity> {
    return this.dataSource.transaction(async (manager) => {
      const orderRepo = manager.getRepository(OrderEntity);
      const itemRepo = manager.getRepository(OrderItemEntity);
      const productRepo = manager.getRepository(Product);

      // Lock the order
      const order = await orderRepo.findOne({
        where: { order_id: id },
        lock: { mode: 'pessimistic_write' },
      });

      if (!order) {
        throw new NotFoundException(
          `Order with id ${id} not found`,
        );
      }

      // Do not modify completed or cancelled orders
      if (
        order.order_status === 'Delivered' ||
        order.order_status === 'Cancelled'
      ) {
        throw new ConflictException(
          `Cannot update an order with status ${order.order_status}`,
        );
      }

      // Restore stock if the order is cancelled
      if (dto.order_status === 'Cancelled') {
        const items = await itemRepo.find({
          where: { order_id: id },
        });

        for (const item of items) {
          if (item.listing_id === null) {
            continue;
          }

          const product = await productRepo.findOne({
            where: { listingId: item.listing_id },
            lock: { mode: 'pessimistic_write' },
          });

          if (!product) {
            throw new NotFoundException(
              `Product listing ${item.listing_id} not found while restoring stock`,
            );
          }

          const currentStock = Number(product.quantityAvailable);

          product.quantityAvailable =
            currentStock + item.quantity;

          await productRepo.save(product);
        }
      }

      order.order_status = dto.order_status;

      await orderRepo.save(order);

      const updatedOrder = await orderRepo.findOne({
        where: { order_id: id },
        relations: { items: true },
      });

      if (!updatedOrder) {
        throw new NotFoundException(
          `Updated order ${id} could not be retrieved`,
        );
      }

      return updatedOrder;
    });
  }
}
