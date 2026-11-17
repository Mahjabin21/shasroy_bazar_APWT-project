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
  @IsInt()
  listing_id: number;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  unit_price: number;
}

export class CreateOrderDto {
  @IsInt()
  user_id: number;

  @IsInt()
  zone_id: number;

  @IsOptional()
  @IsIn(['delivery', 'pickup'])
  fulfillment_type?: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  delivery_address?: string;

  @IsOptional()
  @IsString()
  @Matches(/^01\d{9}$/, {
    message: 'Recipient phone must be a valid Bangladeshi number',
  })
  recipient_phone?: string;
}
