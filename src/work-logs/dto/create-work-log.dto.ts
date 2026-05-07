import { Type } from "class-transformer";
import { IsArray, IsDateString, IsInt, IsNotEmpty, ValidateNested } from "class-validator";
import { WorkLogItemDto } from "src/work-logs-items/dto/work-log-item.dto";

export class CreateWorkLogDto {
  @IsInt()
  team_member_id: number;

  @IsDateString()
  work_date: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkLogItemDto)
  @IsNotEmpty()
  items: WorkLogItemDto[];
}