import { createOllama } from 'ai-sdk-ollama';
import { FactoryProvider } from '@nestjs/common';
import type { LanguageModel } from 'ai';

export const OllamaProvider: FactoryProvider<LanguageModel> = {
  provide: 'AI_MODEL',
  useFactory: () => {
    const ollama = createOllama({
      baseURL: 'http://localhost:11434',
      // Increase timeout for image processing (5 minutes)
      fetch: async (url: string | URL | Request, options?: RequestInit) => {
        return fetch(url, {
          ...options,
          // @ts-expect-error - undici supports these timeout options
          headersTimeout: 300000, // 5 minutes for headers
          bodyTimeout: 300000, // 5 minutes for body
        });
      },
    });
    return ollama('gemma3');
  },
};
