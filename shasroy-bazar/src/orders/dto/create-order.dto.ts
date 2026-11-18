
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import {
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class OrderItemDto {
  @ApiProperty({
    example: 12,
    description: 'Product listing ID',
  })
  @IsInt()
  listing_id: number;

  @ApiProperty({
    example: 2,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({
    example: 25.5,
    description: 'Optional display price. Server-side product price is authoritative.',
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  unit_price?: number;
}

export class CreateOrderDto {
  @ApiProperty({
    example: 3,
    description: 'Service zone ID',
  })
  @IsInt()
  zone_id: number;

  @ApiPropertyOptional({
    enum: ['delivery', 'pickup'],
    default: 'pickup',
  })
  @IsOptional()
  @IsIn(['delivery', 'pickup'])
  fulfillment_type?: string;

  @ApiProperty({
    type: [OrderItemDto],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiPropertyOptional({
    example: 'House 10, Road 2, Dhaka',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  delivery_address?: string;

  @ApiPropertyOptional({
    example: '01712345678',
  })
  @IsOptional()
  @IsString()
  @Matches(/^01\d{9}$/, {
    message: 'Recipient phone must be a valid Bangladeshi number',
  })
  recipient_phone?: string;
}
