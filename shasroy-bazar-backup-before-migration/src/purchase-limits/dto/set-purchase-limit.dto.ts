import { IsIn, IsInt, IsOptional, Min } from 'class-validator';

export class SetPurchaseLimitDto {
  @IsInt()
  listing_id: number;

  @IsInt()
  @Min(1)
  max_quantity: number;

  @IsOptional()
  @IsIn(['daily', 'weekly', 'monthly'])
  period_type?: string;
}
