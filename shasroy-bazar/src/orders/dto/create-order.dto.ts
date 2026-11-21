
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
  Validate,
  ValidateNested,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'orderItemIdentifier', async: false })
export class OrderItemIdentifierValidator
  implements ValidatorConstraintInterface
{
  validate(_: any, args: ValidationArguments): boolean {
    const item = args.object as OrderItemDto;

    const hasListingId = Number.isInteger(item.listing_id);
    const hasBundleId = Number.isInteger(item.bundle_id);

    return hasListingId !== hasBundleId;
  }

  defaultMessage(): string {
    return 'Provide either listing_id or bundle_id, but not both.';
  }
}

export class OrderItemDto {
  @ApiPropertyOptional({
    example: 12,
    description: 'Product listing ID. Provide this OR bundle_id.',
  })
  @IsOptional()
  @IsInt()
  listing_id?: number;

  @ApiPropertyOptional({
    example: 5,
    description: 'Product bundle ID. Provide this OR listing_id.',
  })
  @IsOptional()
  @IsInt()
  bundle_id?: number;

  @ApiProperty({
    example: 2,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({
    example: 25.5,
    description: 'Optional display price. Server-side price is authoritative.',
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  unit_price?: number;

  @Validate(OrderItemIdentifierValidator)
  private readonly orderItemIdentifierCheck?: boolean;
}

export class CreateOrderDto {
  @ApiProperty({
    example: 3,
    description: 'Service zone ID',
  })
  @IsInt()
  zone_id: number;

  @ApiPropertyOptional({
    enum: ['pickup'],
    default: 'pickup',
  })
  @IsOptional()
  @IsIn(['pickup'])
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
