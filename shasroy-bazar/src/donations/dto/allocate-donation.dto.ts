import { IsInt, IsNotEmpty } from 'class-validator';

export class AllocateDonationDto {
  @IsNotEmpty()
  @IsInt()
  org_id: number;
}