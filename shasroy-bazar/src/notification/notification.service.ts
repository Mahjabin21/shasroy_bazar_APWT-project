
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Notification } from './entities/notification.entity.js';
import { Product } from '../products/entities/product.entity.js';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  // CREATE A NOTIFICATION
  async create(
  merchantId: string,
  product: Product,
  title: string,
  message: string,
) {
  const notification = this.notificationRepository.create({
    merchantId,
    product,
    title,
    message,
    isRead: false,
  });

  return this.notificationRepository.save(notification);
}
  // GET ALL NOTIFICATIONS FOR A MERCHANT
  async findByMerchant(merchantId: string) {
    return this.notificationRepository.find({
      where: { merchantId },
      order: { createdAt: 'DESC' },
    });
  }

  // MARK A NOTIFICATION AS READ
  async markAsRead(notificationId: string, merchantId: string) {
    const notification = await this.notificationRepository.findOne({
      where: { notificationId, merchantId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found.');
    }

    notification.isRead = true;

    return this.notificationRepository.save(notification);
  }
}
