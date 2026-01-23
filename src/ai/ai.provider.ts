import { createOllama } from 'ai-sdk-ollama';
import { FactoryProvider } from '@nestjs/common';
import type { LanguageModel } from 'ai';

export const OllamaProvider: FactoryProvider<LanguageModel> = {
  provide: 'AI_MODEL',
  useFactory: () => {
    const ollama = createOllama({
      baseURL: 'http://localhost:11434',
    });
    return ollama('gemma3');
  },
};
