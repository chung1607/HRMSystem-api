import { IsNumber, IsString } from 'class-validator';

export class CreateOwnerSubscriptionDto {
  @IsNumber()
  teamId: number;

  @IsString()
  month: string;

  @IsNumber()
  amount: number;
}
