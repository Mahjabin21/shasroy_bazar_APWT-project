<<<<<<< HEAD

import {
  IsDateString,
=======
import {
  IsDateString,
  IsInt,
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateAdvertisementDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  campaign_name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  content_url: string;

  @IsNotEmpty()
  @IsDateString()
  start_date: string;

  @IsNotEmpty()
  @IsDateString()
  end_date: string;

  @IsNotEmpty()
<<<<<<< HEAD
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  budget: number;
}
=======
  @IsNumber()
  @Min(0)
  budget: number;

  @IsNotEmpty()
  @IsInt()
  org_id: number;
}
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
