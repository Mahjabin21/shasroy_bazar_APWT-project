import {
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class RejectMerchantDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  reason: string;
}