import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class UpdateDeliveryAddressDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  delivery_address: string;

  @IsOptional()
  @IsString()
  @Matches(/^01\d{9}$/, {
    message: 'Recipient phone must be a valid Bangladeshi number',
  })
  recipient_phone?: string;
}
