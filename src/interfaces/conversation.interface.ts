import { IsString, IsInt, Min, ArrayMinSize, IsArray, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

enum Role {
  system = 'system',
  user = 'user',
}

class Message {
  @IsString()
  id: string;

  @IsString()
  text: string;

  @IsEnum(Role)
  role: Role;
}

export class ConversationRequest {
  @IsString()
  conversationId: string;

  @IsInt()
  @Min(0)
  timezoneOffset: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => Message)
  messages: Message[];
}
