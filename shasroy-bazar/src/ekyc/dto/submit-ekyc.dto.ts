import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  Equals,
  Matches,
  IsUrl,
} from 'class-validator';

export class SubmitEkycDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?:\d{10}|\d{13}|\d{17})$/, {
    message: 'NID number must contain 10, 13, or 17 digits',
  })
  nidNumber: string;

  @IsUrl()
  @IsNotEmpty()
  nidFrontUrl: string;

  @IsUrl()
  @IsNotEmpty()
  nidBackUrl: string;

  @IsUrl()
  @IsNotEmpty()
  selfieUrl: string;

  @IsBoolean()
  @Equals(true, {
    message: 'eKYC consent is required',
  })
  consent: boolean;
}
