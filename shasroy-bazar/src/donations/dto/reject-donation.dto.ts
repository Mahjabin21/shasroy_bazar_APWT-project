import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RejectDonationDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  rejection_reason: string;
}