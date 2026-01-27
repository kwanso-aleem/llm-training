import {
  Body,
  Post,
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  UploadedFile,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { AiService } from '../services/ai.service';
import { AiBody, ChatBody, IFile } from '../dtos/ai.input';
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

  @Post('chat')
  async chat(@Body() body: ChatBody, @Res() res: Response) {
    try {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Content-Type-Options', 'nosniff');

      const result = await this.aiService.chat(body.messages);
      result.pipeUIMessageStreamToResponse(res, {
        messageMetadata: ({ part }) => {
          if (part.type === 'start') {
            return {
              createdAt: Date.now(),
              model: 'gemma3',
            };
          }

          if (part.type === 'finish') {
            return {
              totalTokens: part.totalUsage.totalTokens,
            };
          }
        },
      });
    } catch (error) {
      console.error('Chat error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
