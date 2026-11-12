import { Controller } from '@nestjs/common';
import { EkycService } from './ekyc.service.js';

@Controller('ekyc')
export class EkycController {
  constructor(private readonly ekycService: EkycService) {}
}
