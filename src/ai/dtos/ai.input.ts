import { IsNotEmpty, IsString } from 'class-validator';

export class AiBody {
  @IsString()
  @IsNotEmpty()
  prompt: string;
}
