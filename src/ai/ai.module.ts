import { Module } from '@nestjs/common';
import { AiService } from './services/ai.service';
import { AiController } from './controllers/ai.controller';
import { OllamaProvider } from './ai.provider';

@Module({
  providers: [AiService, OllamaProvider],
  controllers: [AiController],
})
export class AiModule {}
