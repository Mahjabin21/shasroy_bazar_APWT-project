import { Controller } from '@nestjs/common';
import { MerchantZonesService } from './merchant-zones.service.js';

@Controller('merchant-zones')
export class MerchantZonesController {
  constructor(private readonly merchantZonesService: MerchantZonesService) {}
}
