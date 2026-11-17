import { Controller } from '@nestjs/common';
import { ExpiryService } from './expiry.service.js';

@Controller('expiry')
export class ExpiryController {
  constructor(private readonly expiryService: ExpiryService) {}
}
