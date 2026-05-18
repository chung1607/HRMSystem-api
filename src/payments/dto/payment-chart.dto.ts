import { IsIn } from 'class-validator';

export class PaymentChartDto {
  @IsIn(['week', 'month', 'year'])
  range: 'week' | 'month' | 'year';
}
