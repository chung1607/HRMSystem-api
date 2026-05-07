import { IsEnum, IsInt, Min } from "class-validator";
import { CaneType } from "../entities/work-logs-items.entity";

export class WorkLogItemDto {
  @IsEnum(CaneType)
  cane_type: CaneType;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsInt()
  @Min(1)
  price_per_unit: number;
}