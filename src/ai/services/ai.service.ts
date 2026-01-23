import { Inject, Injectable } from '@nestjs/common';
import ai from 'ai';

@Injectable()
export class AiService {
  constructor(
    @Inject('GOOGLE_GENERATIVE_AI')
    private readonly googleGenerativeAI: ai.LanguageModel,
  ) {}

  /**
   * Generate text using the Google Generative AI model
   * @param prompt - The prompt to generate text from
   * @returns The generated text
   */
  async generateText(prompt: string) {
    try {
      const result = await ai.generateText({
        model: this.googleGenerativeAI,
        prompt,
        providerOptions: {
          google: {
            apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
          },
        },
      });
      console.log(result);
      return result.text;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
