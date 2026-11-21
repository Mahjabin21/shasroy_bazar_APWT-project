import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateRefundDto {
  @IsInt()
  order_id: number;

<<<<<<< HEAD
=======
  @IsInt()
  user_id: number;

>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(500)
  reason: string;
}
