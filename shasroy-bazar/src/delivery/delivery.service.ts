import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryEntity } from './entities/delivery.entity.js';
import { OrderEntity } from '../orders/entities/order.entity.js';
import { UpdateDeliveryStatusDto } from './dto/update-delivery-status.dto.js';
import { UpdateDeliveryAddressDto } from './dto/update-delivery-address.dto.js';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(DeliveryEntity)
    private readonly deliveryRepo: Repository<DeliveryEntity>,
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
  ) {}

  async createDelivery(
    orderId: number,
    deliveryAddress: string,
    recipientPhone?: string,
  ): Promise<DeliveryEntity> {
    const delivery = this.deliveryRepo.create({
      order_id: orderId,
      delivery_address: deliveryAddress,
      recipient_phone: recipientPhone ?? null,
      delivery_status: 'Pending',
    });
    return await this.deliveryRepo.save(delivery);
  }

  async getAllDeliveries(): Promise<DeliveryEntity[]> {
    return await this.deliveryRepo.find({
      order: { delivery_id: 'DESC' },
    });
  }

  async getDeliveryByOrder(orderId: number): Promise<DeliveryEntity> {
    const delivery = await this.deliveryRepo.findOne({
      where: { order_id: orderId },
    });
    if (!delivery) {
      throw new NotFoundException(`Delivery for order ${orderId} not found`);
    }
    return delivery;
  }

  async updateDeliveryStatus(
    orderId: number,
    dto: UpdateDeliveryStatusDto,
  ): Promise<string> {
    const delivery = await this.deliveryRepo.findOne({
      where: { order_id: orderId },
      relations: { order: true },
    });
    if (!delivery) {
      throw new NotFoundException(`Delivery for order ${orderId} not found`);
    }
    if (delivery.order.order_status === 'Cancelled') {
      throw new BadRequestException(
        `Order ${orderId} is cancelled, delivery cannot be updated`,
      );
    }
    if (delivery.delivery_status === 'Delivered') {
      throw new BadRequestException(
        `Delivery for order ${orderId} is already delivered`,
      );
    }

    delivery.delivery_status = dto.delivery_status;
    if (dto.delivery_status === 'Delivered') {
      delivery.delivered_at = new Date();
    }
    await this.deliveryRepo.save(delivery);

    // Keep the order status in step with the delivery progress
    if (
      dto.delivery_status === 'Shipped' ||
      dto.delivery_status === 'In Transit'
    ) {
      await this.orderRepo.update(orderId, { order_status: 'Shipped' });
    } else if (dto.delivery_status === 'Delivered') {
      await this.orderRepo.update(orderId, { order_status: 'Delivered' });
    }

    return `Delivery status updated to ${dto.delivery_status} for order ${orderId}`;
  }

  async updateDeliveryAddress(
    orderId: number,
    dto: UpdateDeliveryAddressDto,
  ): Promise<string> {
    const delivery = await this.getDeliveryByOrder(orderId);
    if (delivery.delivery_status !== 'Pending') {
      throw new BadRequestException(
        'Delivery address can only be changed while delivery is Pending',
      );
    }

    delivery.delivery_address = dto.delivery_address;
    if (dto.recipient_phone) {
      delivery.recipient_phone = dto.recipient_phone;
    }
    await this.deliveryRepo.save(delivery);
    return `Delivery address updated for order ${orderId}`;
  }
}
