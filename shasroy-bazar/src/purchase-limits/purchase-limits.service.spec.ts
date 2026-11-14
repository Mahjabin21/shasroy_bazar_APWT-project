
import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseLimitsService } from './purchase-limits.service.js';

describe('PurchaseLimitsService', () => {
  let service: PurchaseLimitsService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [PurchaseLimitsService],
      }).compile();

    service = module.get<PurchaseLimitsService>(
      PurchaseLimitsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('isValidTrackingPeriod', () => {

    it('should return true for a valid period', () => {
      const start = new Date('2026-11-01');
      const end = new Date('2026-11-07');

      expect(
        service.isValidTrackingPeriod(start, end),
      ).toBe(true);
    });

    it('should return false when end is before start', () => {
      const start = new Date('2026-11-07');
      const end = new Date('2026-11-01');

      expect(
        service.isValidTrackingPeriod(start, end),
      ).toBe(false);
    });

    it('should return false for the same dates', () => {
      const start = new Date('2026-11-01');
      const end = new Date('2026-11-01');

      expect(
        service.isValidTrackingPeriod(start, end),
      ).toBe(false);
    });

    it('should return false for invalid dates', () => {
      const start = new Date('invalid');
      const end = new Date('2026-11-07');

      expect(
        service.isValidTrackingPeriod(start, end),
      ).toBe(false);
    });

  });
});
