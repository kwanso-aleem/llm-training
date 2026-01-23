import { google } from '@ai-sdk/google';
import { FactoryProvider } from '@nestjs/common';
import ai from 'ai';

export const GoogleGenerativeAIProvider: FactoryProvider<ai.LanguageModel> = {
  provide: 'GOOGLE_GENERATIVE_AI',
  useFactory: () => {
    // return createGoogleGenerativeAI({
    //   apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    // });

    return google('gemini-2.5-flash');
  },
};
