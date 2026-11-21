<<<<<<< HEAD
=======

>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
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
<<<<<<< HEAD
=======

import { ServiceZone } from '../service-zones/entities/service-zone.entity.js';
import { MerchantZone } from '../merchant-zones/entities/merchant-zone.entity.js';
import { DeliveryEntity } from '../delivery/entities/delivery.entity.js';
import { Notification } from '../notification/entities/notification.entity.js';
import { User } from '../users/entities/user.entity.js';
import { PurchaseLimitsService } from '../purchase-limits/purchase-limits.service.js';

>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
import {
  Product,
  ProductListingStatus,
} from '../products/entities/product.entity.js';

<<<<<<< HEAD
import {
  ProductBundle,
  BundleStatus,
} from '../bundles/entities/product-bundle.entity.js';

import { BundleItem } from '../bundles/entities/bundle-item.entity.js';
import { ServiceZone } from '../service-zones/entities/service-zone.entity.js';
import { MerchantZone } from '../merchant-zones/entities/merchant-zone.entity.js';

import { Notification } from '../notification/entities/notification.entity.js';
import { User } from '../users/entities/user.entity.js';

import { PurchaseLimitsService } from '../purchase-limits/purchase-limits.service.js';

=======
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
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
<<<<<<< HEAD
  async placeOrder(
    userId: number,
    dto: CreateOrderDto,
  ): Promise<OrderEntity> {
    const fulfillmentType = dto.fulfillment_type ?? 'pickup';


    if (fulfillmentType !== 'pickup') {
      throw new BadRequestException(
        'Only customer pickup is available in Release 1',
=======
  async placeOrder(userId: number, dto: CreateOrderDto): Promise<OrderEntity> {
    const fulfillmentType = dto.fulfillment_type ?? 'pickup';

    if (fulfillmentType === 'delivery' && !dto.delivery_address) {
      throw new BadRequestException(
        'delivery_address is required for delivery orders',
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
      );
    }

    if (!dto.items || dto.items.length === 0) {
<<<<<<< HEAD
      throw new BadRequestException(
        'At least one order item is required',
      );
    }

    // FR-34: Check purchase limits for products and bundle components.
    await this.purchaseLimitsService.checkPurchaseLimits(
      userId,
      dto.items,
    );

    const savedOrderResult = await this.dataSource.transaction(
      async (manager) => {
        const productRepo = manager.getRepository(Product);
        const bundleRepo = manager.getRepository(ProductBundle);
        const bundleItemRepo = manager.getRepository(BundleItem);
        const orderRepo = manager.getRepository(OrderEntity);
        const itemRepo = manager.getRepository(OrderItemEntity);

        // Check service zone.
        const zone = await manager
          .getRepository(ServiceZone)
          .findOne({
            where: { zoneId: dto.zone_id },
          });

        if (!zone) {
          throw new NotFoundException(
            `Service zone ${dto.zone_id} not found`,
          );
        }

        if (zone.zoneStatus !== 'active') {
          throw new BadRequestException(
            'This service zone is inactive',
          );
        }

        const merchantZoneRepo =
          manager.getRepository(MerchantZone);

        let totalPaisa = 0;
        let orderMerchantId: number | null = null;

        // Store order items before saving them.
        const orderItems: Array<{
          listing_id: number | null;
          bundle_id: number | null;
          quantity: number;
          unit_price: number;
        }> = [];

        // Combine required stock for repeated products.
        const stockRequirements = new Map<number, number>();

        // Keep loaded products to avoid loading the same product repeatedly.
        const loadedProducts = new Map<number, Product>();

        // Validate that all order items belong to one merchant.
        const checkMerchant = (merchantId: number) => {
          if (orderMerchantId === null) {
            orderMerchantId = merchantId;
          } else if (orderMerchantId !== merchantId) {
            throw new BadRequestException(
              'All products and bundles in one order must belong to the same merchant.',
            );
          }
        };

        // Add required stock for a product.
        const addStockRequirement = (
          listingId: number,
          quantity: number,
        ) => {
          stockRequirements.set(
            listingId,
            (stockRequirements.get(listingId) ?? 0) + quantity,
          );
        };

        // Validate and load a product.
        const getValidatedProduct = async (
          listingId: number,
        ): Promise<Product> => {
          let product = loadedProducts.get(listingId);

        if (!product) {
            const foundProduct = await productRepo.findOne({
              where: { listingId },
             lock: { mode: 'pessimistic_write' },
        });

       if (!foundProduct) {
            throw new NotFoundException(`Product ${listingId} not found`);
        }

              product = foundProduct;

            loadedProducts.set(listingId, product);
          }

          if (
            product.listingStatus !== ProductListingStatus.ACTIVE
          ) {
            throw new BadRequestException(
              `${product.productName} is not active`,
            );
          }

          // Check product expiry date.
          const today = new Date().toISOString().slice(0, 10);

          if (product.expiryDate < today) {
            throw new BadRequestException(
              `${product.productName} has expired and cannot be ordered`,
            );
          }

          // FR-07: Check merchant's service zone.
        

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

          return product;
        };

        // Process each order item.
        for (const item of dto.items) {
          if (
            !Number.isInteger(item.quantity) ||
            item.quantity < 1
          ) {
            throw new BadRequestException(
              'Quantity must be a positive integer',
            );
          }

          // -----------------------------------------
          // CASE 1: Individual product
          // -----------------------------------------
          if (item.listing_id !== undefined) {
            const product = await getValidatedProduct(
              item.listing_id,
            );

            checkMerchant(product.merchantId);

            const price = Number(product.systemPrice);

            if (!Number.isFinite(price) || price < 0) {
              throw new BadRequestException(
                `Invalid price for ${product.productName}`,
              );
            }

            totalPaisa +=
              Math.round(price * 100) * item.quantity;

            addStockRequirement(
              product.listingId,
              item.quantity,
            );

            orderItems.push({
              listing_id: product.listingId,
              bundle_id: null,
              quantity: item.quantity,
              unit_price: price,
            });

            continue;
          }

          // -----------------------------------------
          // CASE 2: Product bundle
          // -----------------------------------------
          if (item.bundle_id !== undefined) {
            const bundle = await bundleRepo.findOne({
              where: {
                bundleId: item.bundle_id,
              },
              lock: { mode: 'pessimistic_write' },
            });

            if (!bundle) {
              throw new NotFoundException(
                `Bundle ${item.bundle_id} not found`,
              );
            }

            if (bundle.bundleStatus !== BundleStatus.ACTIVE) {
              throw new BadRequestException(
                `${bundle.bundleName} is inactive and cannot be ordered`,
              );
            }

            checkMerchant(bundle.merchantId);

            // Get products inside the bundle.
            const bundleItems = await bundleItemRepo.find({
              where: {
                bundleId: bundle.bundleId,
              },
            });

            if (bundleItems.length === 0) {
              throw new BadRequestException(
                `${bundle.bundleName} contains no products`,
              );
            }

            // Use the saved server-side bundle price.
            const bundlePrice = Number(bundle.bundlePrice);

            if (
              !Number.isFinite(bundlePrice) ||
              bundlePrice < 0
            ) {
              throw new BadRequestException(
                `Invalid price for bundle ${bundle.bundleName}`,
              );
            }

            totalPaisa +=
              Math.round(bundlePrice * 100) * item.quantity;

            // Validate every product inside the bundle.
            for (const bundleItem of bundleItems) {
              const componentQuantity = Number(
                bundleItem.quantity,
              );

              if (
                !Number.isInteger(componentQuantity) ||
                componentQuantity < 1
              ) {
                throw new BadRequestException(
                  `Invalid product quantity in bundle ${bundle.bundleName}`,
                );
              }

              const product = await getValidatedProduct(
                bundleItem.listingId,
              );

              // A bundle must contain products from its own merchant.
              if (product.merchantId !== bundle.merchantId) {
                throw new BadRequestException(
                  `A product in bundle ${bundle.bundleName} does not belong to its merchant`,
                );
              }

              // Example:
              // 2 bundles x 3 apples per bundle = 6 apples.
              addStockRequirement(
                product.listingId,
                componentQuantity * item.quantity,
              );
            }

            orderItems.push({
              listing_id: null,
              bundle_id: bundle.bundleId,
              quantity: item.quantity,
              unit_price: bundlePrice,
            });

            continue;
          }

          throw new BadRequestException(
            'Each order item must contain either listing_id or bundle_id',
          );
        }

        // -----------------------------------------
        // Reserve stock after calculating all requirements.
        // This prevents duplicate stock deductions.
        // -----------------------------------------
        for (const [listingId, requiredQuantity] of stockRequirements) {
          const product = loadedProducts.get(listingId);

          if (!product) {
            throw new NotFoundException(
              `Product listing ${listingId} not found`,
            );
          }

          const availableStock = Number(
            product.quantityAvailable,
          );

          if (availableStock < requiredQuantity) {
            throw new BadRequestException(
              `Insufficient stock for ${product.productName}. ` +
              `Available: ${availableStock}, Required: ${requiredQuantity}`,
            );
          }

          product.quantityAvailable =
            availableStock - requiredQuantity;

          await productRepo.save(product);
        }

        // Generate pickup details.
        const pickupCode = String(
          randomInt(100000, 1000000),
        );

        const reservationExpiresAt = new Date(
          Date.now() + 2 * 60 * 60 * 1000,
        );

        // Create order.
        const order = orderRepo.create({
          order_status: 'Pending Payment',
          fulfillment_type: 'pickup',
          pickup_code: pickupCode,
          reservation_expires_at: reservationExpiresAt,
          total_amount: (totalPaisa / 100).toFixed(2),
          user_id: userId,
          zone_id: dto.zone_id,

          // Release 1 supports pickup only.
          delivery_address: null,
          recipient_phone: null,
        });

        const savedOrder = await orderRepo.save(order);

        // Save individual product and bundle order items.
        const savedOrderItems = orderItems.map((item) =>
          itemRepo.create({
            order_id: savedOrder.order_id,
            listing_id: item.listing_id,
            bundle_id: item.bundle_id,
            quantity: item.quantity,
            unit_price: item.unit_price.toFixed(2),
          }),
        );

        await itemRepo.save(savedOrderItems);

        // FR-71: Notify customer that order was placed.
        const notificationRepo =
          manager.getRepository(Notification);

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
          where: {
            order_id: savedOrder.order_id,
          },
          relations: {
            items: true,
          },
        });
      },
    );

    // Record purchase quantities after successful order creation.
    await this.purchaseLimitsService.recordPurchases(
      userId,
      dto.items,
    );
=======
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
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361

    return savedOrderResult;
  }

  // 2. Get all orders
  async getAllOrders(): Promise<OrderEntity[]> {
    return this.orderRepo.find({
<<<<<<< HEAD
      relations: {
        items: true,
      },
      order: {
        order_id: 'DESC',
      },
=======
      relations: { items: true },
      order: { order_id: 'DESC' },
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
    });
  }

  // 3. Get orders belonging to a user
<<<<<<< HEAD
  async getOrdersByUser(
    userId: number,
  ): Promise<OrderEntity[]> {
    return this.orderRepo.find({
      where: {
        user_id: userId,
      },
      relations: {
        items: true,
      },
      order: {
        order_id: 'DESC',
      },
=======
  async getOrdersByUser(userId: number): Promise<OrderEntity[]> {
    return this.orderRepo.find({
      where: { user_id: userId },
      relations: { items: true },
      order: { order_id: 'DESC' },
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
    });
  }

  // 4. Get a single order by ID
  async getOrderById(
    id: number,
<<<<<<< HEAD
    requester?: {
      role: string;
      userId?: number;
    },
  ): Promise<OrderEntity> {
    const order = await this.orderRepo.findOne({
      where: {
        order_id: id,
      },
      relations: {
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException(
        `Order with id ${id} not found`,
      );
    }

    if (
      requester?.role === 'user' &&
      order.user_id !== requester.userId
    ) {
      throw new ForbiddenException(
        'You can only view your own orders',
      );
=======
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
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
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
<<<<<<< HEAD
      const itemRepo = manager.getRepository(OrderItemEntity);
      const productRepo = manager.getRepository(Product);
      const bundleItemRepo = manager.getRepository(BundleItem);

      const order = await orderRepo.findOne({
        where: {
          order_id: id,
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (!order) {
        throw new NotFoundException(
          `Order with id ${id} not found`,
        );
      }

      order.items = await itemRepo.find({
        where: {
          order_id: id,
        },
      });

      // Prevent changes to final orders.
=======

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
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
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

<<<<<<< HEAD
      // Only merchant pickup-code verification should complete pickup.
      if (dto.order_status === 'Picked Up') {
        throw new BadRequestException(
          'Pickup completion must be confirmed by the merchant using the pickup code',
        );
      }

=======
      // Pickup orders require handover confirmation
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
      if (
        order.fulfillment_type === 'pickup' &&
        dto.order_status === 'Delivered'
      ) {
        throw new BadRequestException(
<<<<<<< HEAD
          'Pickup orders cannot be marked as Delivered',
=======
          'Pickup orders must be completed through pickup handover confirmation',
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
        );
      }

      if (
<<<<<<< HEAD
        dto.order_status === 'No Show' &&
        order.fulfillment_type !== 'pickup'
      ) {
        throw new BadRequestException(
          'No Show is only valid for pickup orders',
        );
      }

      // Restore stock for cancelled and no-show orders.
      if (
        dto.order_status === 'Cancelled' ||
        dto.order_status === 'No Show'
      ) {
        const stockToRestore = new Map<number, number>();

        // Calculate all stock that must be restored.
        for (const item of order.items ?? []) {
          if (item.listing_id !== null) {
            stockToRestore.set(
              item.listing_id,
              (stockToRestore.get(item.listing_id) ?? 0) +
                item.quantity,
            );
          }

          if (item.bundle_id !== null) {
            const bundleItems = await bundleItemRepo.find({
              where: {
                bundleId: item.bundle_id,
              },
            });

            if (bundleItems.length === 0) {
              throw new BadRequestException(
                `Cannot restore stock because bundle ${item.bundle_id} has no saved component products`,
              );
            }

            for (const bundleItem of bundleItems) {
              const componentQuantity = Number(
                bundleItem.quantity,
              );

              if (
                !Number.isInteger(componentQuantity) ||
                componentQuantity < 1
              ) {
                throw new BadRequestException(
                  `Invalid component quantity in bundle ${item.bundle_id}`,
                );
              }

              const restoreQuantity =
                componentQuantity * item.quantity;

              stockToRestore.set(
                bundleItem.listingId,
                (stockToRestore.get(bundleItem.listingId) ?? 0) +
                  restoreQuantity,
              );
            }
          }
        }

        // Restore each product once.
        for (const [listingId, quantity] of stockToRestore) {
          const product = await productRepo.findOne({
            where: {
              listingId,
            },
            lock: {
              mode: 'pessimistic_write',
            },
          });

          if (product) {
            const currentStock = Number(
              product.quantityAvailable,
            );

            product.quantityAvailable =
              currentStock + quantity;

=======
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
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
            await productRepo.save(product);
          }
        }

        order.pickup_code = null;

        if (dto.order_status === 'No Show') {
          order.no_show_at = new Date();
        }
      }

<<<<<<< HEAD
      order.order_status = dto.order_status;

      await orderRepo.save(order);

      // Notify customer about order status update.
      const notificationRepo =
        manager.getRepository(Notification);
=======
      if (dto.order_status === 'Picked Up') {
        order.merchant_handover_at = new Date();
      }

      order.order_status = dto.order_status;
      await orderRepo.save(order);

      // Notify customer about order status update
      const notificationRepo = manager.getRepository(Notification);
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361

      await notificationRepo.save(
        notificationRepo.create({
          type: 'ORDER_STATUS',
<<<<<<< HEAD
          message:
            `Your order #${id} is now ${dto.order_status}.`,
          user: {
            userId: order.user_id,
          } as User,
=======
          message: `Your order #${id} is now ${dto.order_status}.`,
          user: { userId: order.user_id } as User,
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
          relatedOrderId: id,
        }),
      );

      return `Order status updated to ${dto.order_status} for order ${id}`;
    });
  }
}
