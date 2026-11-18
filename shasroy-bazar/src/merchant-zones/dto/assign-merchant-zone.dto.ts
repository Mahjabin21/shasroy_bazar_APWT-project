import {
  IsInt,
  IsNotEmpty,
  Min,
} from 'class-validator';

export class AssignMerchantZoneDto {

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  merchantId: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  zoneId: number;
}