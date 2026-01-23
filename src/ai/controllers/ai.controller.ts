import {
  Body,
  Post,
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  UploadedFile,
} from '@nestjs/common';
import { AiService } from '../services/ai.service';
import { AiBody, IFile } from '../dtos/ai.input';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate-text')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(
    FileInterceptor('file', {
      // fileFilter: (_req, file, callback) => mediaFilesFilter(file, callback),
    }),
  )
  async generateText(@UploadedFile() file: IFile, @Body() body: AiBody) {
    const { buffer } = file;
    return await this.aiService.generateText(body.prompt, buffer);
  }
}
