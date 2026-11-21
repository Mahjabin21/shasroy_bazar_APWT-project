
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
<<<<<<< HEAD
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
=======
  ValidateNested,
} from 'class-validator';

export class OrderItemDto {
  @ApiProperty({
    example: 12,
    description: 'Product listing ID',
  })
  @IsInt()
  listing_id: number;
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361

  @ApiProperty({
    example: 2,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({
    example: 25.5,
<<<<<<< HEAD
    description: 'Optional display price. Server-side price is authoritative.',
=======
    description: 'Optional display price. Server-side product price is authoritative.',
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  unit_price?: number;
<<<<<<< HEAD

  @Validate(OrderItemIdentifierValidator)
  private readonly orderItemIdentifierCheck?: boolean;
=======
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
}

export class CreateOrderDto {
  @ApiProperty({
    example: 3,
    description: 'Service zone ID',
  })
  @IsInt()
  zone_id: number;

  @ApiPropertyOptional({
<<<<<<< HEAD
    enum: ['pickup'],
    default: 'pickup',
  })
  @IsOptional()
  @IsIn(['pickup'])
=======
    enum: ['delivery', 'pickup'],
    default: 'pickup',
  })
  @IsOptional()
  @IsIn(['delivery', 'pickup'])
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
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
