

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsPositive,
  IsDateString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  productName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  category: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  quantityAvailable: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  unit: string;

  @IsOptional()
  @IsString()
  productPhotoUrl?: string;

  @IsDateString()
  expiryDate: string;

  @IsString()
  @IsNotEmpty()
  expiryPhotoUrl: string;

   @Type(() => Number)
   @IsNumber({ maxDecimalPlaces: 2 })
   @IsPositive()
   merchantOriginalPrice: number;
}
