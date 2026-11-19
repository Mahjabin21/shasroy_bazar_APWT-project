import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateOrganizationDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  org_name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  contact_person: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(11)
  @MaxLength(20)
  contact_phone: string;
}