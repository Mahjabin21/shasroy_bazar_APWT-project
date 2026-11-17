import { Test, TestingModule } from '@nestjs/testing';
import { AdvertisingRevenueController } from './advertising-revenue.controller.js';
import { AdvertisingRevenueService } from './advertising-revenue.service.js';

describe('AdvertisingRevenueController', () => {
  let controller: AdvertisingRevenueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdvertisingRevenueController],
      providers: [AdvertisingRevenueService],
    }).compile();

    controller = module.get<AdvertisingRevenueController>(AdvertisingRevenueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
