
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsEnum,
} from 'class-validator';

import { BundleStatus } from '../entities/product-bundle.entity.js';

export class UpdateBundleDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  bundleName?: string;

  @IsOptional()
  @IsEnum(BundleStatus)
  bundleStatus?: BundleStatus;
}
