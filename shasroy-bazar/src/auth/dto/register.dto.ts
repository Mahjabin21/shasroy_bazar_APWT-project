import {IsBoolean,IsDateString,IsNotEmpty,IsString,Matches} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @Matches(/^01\d{9}$/, {
    message: 'Mobile number must be a valid Bangladeshi number',
  })
  mobileNumber: string;

  @IsDateString()
  dateOfBirth: string;

  @IsString()
  @Matches(/^\d{4,6}$/, {
    message: 'PIN must contain 4 to 6 digits',
  })
  pin: string;

  @IsBoolean()
  termsConsent: boolean;
}