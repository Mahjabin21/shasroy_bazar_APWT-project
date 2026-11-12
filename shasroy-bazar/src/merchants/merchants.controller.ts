import { Controller } from '@nestjs/common';
import { MerchantsService } from './merchants.service.js';

@Controller('merchants')
export class MerchantsController {
  constructor(private readonly merchantsService: MerchantsService) {}
}
