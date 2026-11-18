import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateAdvertisingRevenueDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  payment_ref: string;

  @IsNotEmpty()
  @IsDateString()
  period_start: string;

  @IsNotEmpty()
  @IsDateString()
  period_end: string;

  @IsNotEmpty()
  @IsInt()
  ad_id: number;
}