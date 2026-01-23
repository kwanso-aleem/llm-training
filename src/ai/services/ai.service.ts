import { Inject, Injectable } from '@nestjs/common';
import { generateText } from 'ai';
import type { LanguageModel } from 'ai';

@Injectable()
export class AiService {
  constructor(
    @Inject('AI_MODEL')
    private readonly aiModel: LanguageModel,
  ) {}

  /**
   * Generate text using the AI model
   * @param prompt - The prompt to generate text from
   * @returns The generated text
   */
  async generateText(prompt: string) {
    try {
      const result = await generateText({
        model: this.aiModel,
        prompt,
      });
      console.log(result);
      return result.text;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
