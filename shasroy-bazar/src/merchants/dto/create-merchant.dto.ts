
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateMerchantDto {

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  businessName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  businessCategory: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  contactPerson: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  contactPhone: string;

  @IsOptional()
  @IsString()
  tradeLicenseRef?: string;
}
