
import {
  IsString,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';

export class CreateBundleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  bundleName: string;
}
