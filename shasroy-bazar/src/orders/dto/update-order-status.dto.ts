import { IsIn } from 'class-validator';

export const ORDER_STATUSES = [
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
];

export class UpdateOrderStatusDto {
  @IsIn(ORDER_STATUSES)
  order_status: string;
}
