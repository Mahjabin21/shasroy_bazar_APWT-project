import { Controller } from '@nestjs/common';
import { ServiceZonesService } from './service-zones.service.js';

@Controller('service-zones')
export class ServiceZonesController {
  constructor(private readonly serviceZonesService: ServiceZonesService) {}
}
