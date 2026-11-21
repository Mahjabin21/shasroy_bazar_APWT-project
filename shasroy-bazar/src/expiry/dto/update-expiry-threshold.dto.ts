
import { IsInt, Min, Max } from 'class-validator';

export class UpdateExpiryThresholdDto {
  @IsInt()
  @Min(1)
  @Max(365)
  thresholdDays: number;
}
