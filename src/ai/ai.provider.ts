import type { LanguageModel } from 'ai';
import { createOllama } from 'ai-sdk-ollama';
import { FactoryProvider } from '@nestjs/common';
// constants
import {
  AppProviders,
  AI_MODEL_NAME,
  AI_MODEL_BASE_URL,
} from './lib/constants';

export const OllamaProvider: FactoryProvider<LanguageModel> = {
  provide: AppProviders.AI_MODEL,
  useFactory: () => {
    const ollama = createOllama({
      baseURL: AI_MODEL_BASE_URL,
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
    // Use llama3.2-vision for vision capabilities (image understanding)
    // Alternative: llava, bakllava, or other vision models
    return ollama(AI_MODEL_NAME);
  },
};
