import { Test, TestingModule } from '@nestjs/testing';
import { AdvertisingRevenueService } from './advertising-revenue.service.js';

describe('AdvertisingRevenueService', () => {
  let service: AdvertisingRevenueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdvertisingRevenueService],
    }).compile();

    service = module.get<AdvertisingRevenueService>(AdvertisingRevenueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
