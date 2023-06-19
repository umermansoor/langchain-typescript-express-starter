import { IsString, Length, IsBoolean } from 'class-validator';


export class ChatRequestDto {
    @IsString()
    @Length(2, 255)
    public message: string;

    @IsBoolean()
    public stream: boolean = true;
  }