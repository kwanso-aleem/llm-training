import type { Response } from 'express';
import { Res, Body, Post, Controller } from '@nestjs/common';
// services
import { AiService } from '../services/ai.service';
// inputs
import { ChatBody } from '../dtos/ai.input';
// constants
import { AI_MODEL_NAME } from '../lib/constants';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

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
              model: AI_MODEL_NAME,
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
