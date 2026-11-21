<<<<<<< HEAD

import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
=======
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361

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
<<<<<<< HEAD
}
=======
}
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
