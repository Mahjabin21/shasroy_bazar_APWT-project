import { PartialType } from '@nestjs/swagger';
import { CreateAdvertisementDto } from './create-advertisement.dto.js';

export class UpdateAdvertisementDto extends PartialType(CreateAdvertisementDto) {}