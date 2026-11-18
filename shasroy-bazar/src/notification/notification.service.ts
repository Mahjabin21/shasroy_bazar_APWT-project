
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto.js';
import { Notification } from './entities/notification.entity.js';

import { User } from '../users/entities/user.entity.js';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async createNotification(dto: CreateNotificationDto) {
    const notification = this.notificationRepository.create({
      type: dto.type,
      message: dto.message,
      user: { userId: dto.userId } as User,
      relatedOrderId: dto.relatedOrderId ?? null,
    });

    return this.notificationRepository.save(notification);
  }

  async getUserNotifications(userId: number) {
    return this.notificationRepository.find({
      where: { user: { userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(notificationId: number, userId: number) {
    const notification = await this.notificationRepository.findOne({
      where: { notificationId, user: { userId } },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    notification.isRead = true;
    return this.notificationRepository.save(notification);
  }

  async markAllAsRead(userId: number) {
    const notifications = await this.notificationRepository.find({
      where: { user: { userId }, isRead: false },
    });

    for (const notification of notifications) {
      notification.isRead = true;
    }

    await this.notificationRepository.save(notifications);

    return {
      message: 'All notifications marked as read',
      updatedCount: notifications.length,
    };
  }
}
