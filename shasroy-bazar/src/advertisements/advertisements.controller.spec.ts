import { Test, TestingModule } from '@nestjs/testing';
import { AdvertisementsController } from './advertisements.controller.js';
import { AdvertisementsService } from './advertisements.service.js';

describe('AdvertisementsController', () => {
  let controller: AdvertisementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdvertisementsController],
      providers: [AdvertisementsService],
    }).compile();

    controller = module.get<AdvertisementsController>(AdvertisementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
