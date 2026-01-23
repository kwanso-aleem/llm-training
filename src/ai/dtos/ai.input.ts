import { IsNotEmpty, IsString } from 'class-validator';

export class AiBody {
  @IsString()
  @IsNotEmpty()
  prompt: string;
}

export class IFile {
  size?: number;
  encoding?: string;
  fieldname?: string;
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}
