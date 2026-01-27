import { UIMessage } from 'ai';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AiBody {
  @IsString()
  @IsNotEmpty()
  prompt: string;
}

export class ChatBody {
  @IsNotEmpty()
  @IsArray()
  messages: UIMessage[];

  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  trigger?: string;
}

export class IFile {
  size?: number;
  encoding?: string;
  fieldname?: string;
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}
