import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, MaxLength, NotEquals } from 'class-validator';

export class AdjustStockDto {
  @ApiProperty({ example: 10, description: 'Positive to add stock, negative to remove stock' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @NotEquals(0)
  quantity: number;

  @ApiProperty({ example: 'RESTOCK' })
  @IsString()
  @MaxLength(30)
  reason: string;

  @ApiPropertyOptional({ example: 'Weekly supplier delivery' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}
