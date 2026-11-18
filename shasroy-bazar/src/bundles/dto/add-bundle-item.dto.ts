
import {
  IsInt,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class AddBundleItemDto {
  @IsInt()
  @Min(1)
  listingId: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(99999999.99)
  quantity: number;
}

