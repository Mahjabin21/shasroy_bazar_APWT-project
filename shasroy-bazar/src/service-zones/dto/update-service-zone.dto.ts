import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceZoneDto } from './create-service-zone.dto.js';

export class UpdateServiceZoneDto extends PartialType(CreateServiceZoneDto) {}