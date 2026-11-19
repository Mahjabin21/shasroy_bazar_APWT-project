import { IsIn } from 'class-validator';

export const DELIVERY_STATUSES = [
  'Pending',
  'Shipped',
  'In Transit',
  'Delivered',
  'Failed',
];

export class UpdateDeliveryStatusDto {
  @IsIn(DELIVERY_STATUSES)
  delivery_status: string;
}
