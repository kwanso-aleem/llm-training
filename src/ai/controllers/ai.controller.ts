import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from '../services/ai.service';
import { AiBody } from '../dtos/ai.input';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate-text')
  async generateText(@Body() body: AiBody) {
    return await this.aiService.generateText(body.prompt);
  }
}
