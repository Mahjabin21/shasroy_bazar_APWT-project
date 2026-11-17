import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrdersService } from './orders.service.js';
import { OrderEntity } from './entities/order.entity.js';
import { OrderItemEntity } from './entities/order-item.entity.js';
import { PurchaseLimitsService } from '../purchase-limits/purchase-limits.service.js';
import { DeliveryService } from '../delivery/delivery.service.js';

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: getRepositoryToken(OrderEntity), useValue: {} },
        { provide: getRepositoryToken(OrderItemEntity), useValue: {} },
        { provide: PurchaseLimitsService, useValue: {} },
        { provide: DeliveryService, useValue: {} },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
