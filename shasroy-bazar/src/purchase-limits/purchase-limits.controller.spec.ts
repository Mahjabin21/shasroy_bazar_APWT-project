import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseLimitsController } from './purchase-limits.controller.js';

describe('PurchaseLimitsController', () => {
  let controller: PurchaseLimitsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseLimitsController],
    }).compile();

    controller = module.get<PurchaseLimitsController>(PurchaseLimitsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
