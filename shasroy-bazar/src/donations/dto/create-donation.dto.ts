import { IsInt, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateDonationDto {
  @IsNotEmpty()
  @IsInt()
  listing_id: number;

  @IsNotEmpty()
  @IsInt()
  zone_id: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;
}