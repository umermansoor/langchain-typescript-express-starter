import { IsString, IsInt, Min, ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class MessageDTO {
  @IsString()
  id: string;

  @IsString()
  text: string;
}

export class ConversationDTO {
  @IsString()
  id: string;

  @IsInt()
  @Min(0)
  timezoneOffset: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => MessageDTO)
  messages: MessageDTO[];
}
