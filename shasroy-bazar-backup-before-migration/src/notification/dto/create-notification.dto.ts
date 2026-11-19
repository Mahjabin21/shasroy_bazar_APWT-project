
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  type: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsInt()
  userId: number;

  @IsOptional()
  @IsInt()
  relatedOrderId?: number | null;
}
