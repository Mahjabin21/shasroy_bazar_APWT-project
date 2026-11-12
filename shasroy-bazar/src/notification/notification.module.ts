import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service.js';
import { NotificationController } from './notification.controller.js';

@Module({
   //imports: [TypeOrmModule.forFeature([User])],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
