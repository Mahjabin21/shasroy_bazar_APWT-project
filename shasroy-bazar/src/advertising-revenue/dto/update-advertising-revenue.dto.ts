import { PartialType } from '@nestjs/swagger';
import { CreateAdvertisingRevenueDto } from './create-advertising-revenue.dto.js';

export class UpdateAdvertisingRevenueDto extends PartialType(CreateAdvertisingRevenueDto) {}