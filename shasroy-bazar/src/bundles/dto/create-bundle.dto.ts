
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsUUID,
} from 'class-validator';

export class CreateBundleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  bundleName: string;

  @IsUUID()
  merchantId: string;
}
