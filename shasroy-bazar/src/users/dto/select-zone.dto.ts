import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class SelectZoneDto {
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  zoneId: number;
}