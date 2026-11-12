import { Controller } from '@nestjs/common';
import { AdministratorService } from './administrator.service.js';

@Controller('administrator')
export class AdministratorController {
  constructor(private readonly administratorService: AdministratorService) {}
}
