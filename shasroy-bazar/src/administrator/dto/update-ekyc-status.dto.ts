import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { VerificationStatus } from '../../common/enum/verification-status.enum.js';

export class UpdateEkycStatusDto {
  @ApiProperty({
    enum: [VerificationStatus.Verified, VerificationStatus.Rejected],
    example: VerificationStatus.Verified,
  })
  @IsIn([VerificationStatus.Verified, VerificationStatus.Rejected], {
    message: 'status must be either verified or rejected',
  })
  status: VerificationStatus;
}