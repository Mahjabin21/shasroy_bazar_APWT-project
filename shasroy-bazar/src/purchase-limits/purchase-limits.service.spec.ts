import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseLimitsService } from './purchase-limits.service.js';

describe('PurchaseLimitsService', () => {
  let service: PurchaseLimitsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PurchaseLimitsService],
    }).compile();

    service = module.get<PurchaseLimitsService>(PurchaseLimitsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
