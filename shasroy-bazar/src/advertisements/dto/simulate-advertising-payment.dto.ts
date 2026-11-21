
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsUUID } from 'class-validator';

export class SimulateAdvertisingPaymentDto {
  @ApiProperty({
    example: 'bKash',
    enum: ['bKash', 'Nagad', 'Card'],
  })
  @IsIn(['bKash', 'Nagad', 'Card'])
  payment_method!: string;

  @ApiProperty({
    example: 'success',
    enum: ['success', 'failure'],
    description: 'Testing only: choose the simulated payment result',
  })
  @IsIn(['success', 'failure'])
  simulation_result!: 'success' | 'failure';

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description:
      'Unique reference for this advertising payment request. Reuse it when retrying the same request.',
  })
  @IsUUID()
  idempotency_ref!: string;
}
