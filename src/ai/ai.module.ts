import { Module } from '@nestjs/common';
import { AiService } from './services/ai.service';
import { AiController } from './controllers/ai.controller';
import { GoogleGenerativeAIProvider } from './ai.provider';

@Module({
  providers: [AiService, GoogleGenerativeAIProvider],
  controllers: [AiController],
})
export class AiModule {}
