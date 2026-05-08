import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreatePaymentDto {
  @IsInt()
  team_member_id: number;

  @IsNumber()
  @Min(1)
  amount: number;

  @IsDateString()
  payment_date: Date;

  @IsOptional()
  @IsString()
  note?: string;
}