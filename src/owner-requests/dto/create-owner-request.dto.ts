import { IsNotEmpty } from 'class-validator';

export class CreateOwnerRequestDto {
  @IsNotEmpty()
  description: string;
}
