import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class LoginDto {
  @IsString()
  @Matches(/^01\d{9}$/, 
  {
    message: 'Mobile number must be a valid Bangladeshi number',
  })
  mobileNumber: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4,6}$/, 
  {
    message: 'PIN must contain 4 to 6 digits',
  })
  pin: string;
}