import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseLimitsController } from './purchase-limits.controller.js';
import { PurchaseLimitsService } from './purchase-limits.service.js';

describe('PurchaseLimitsController', () => {
  let controller: PurchaseLimitsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseLimitsController],
      providers: [{ provide: PurchaseLimitsService, useValue: {} }],
    }).compile();

    controller = module.get<PurchaseLimitsController>(PurchaseLimitsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
