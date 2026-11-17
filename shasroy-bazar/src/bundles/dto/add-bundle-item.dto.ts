
import {
  IsUUID,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class AddBundleItemDto {
  @IsUUID()
  listingId: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(99999999.99)
  quantity: number;
}
