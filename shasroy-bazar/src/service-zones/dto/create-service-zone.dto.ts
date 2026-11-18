import {IsString,IsNotEmpty,IsOptional,IsIn,MaxLength,} from 'class-validator';

export class CreateServiceZoneDto {

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  zoneName: string;

  @IsString()
  @IsNotEmpty()
  boundaryDefinition: string;

  @IsOptional()
  @IsString()
  @IsIn(['active', 'inactive'])
  zoneStatus?: string;
}