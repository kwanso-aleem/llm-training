import { Inject, Injectable } from '@nestjs/common';
import { convertToModelMessages, generateText, streamText } from 'ai';
import type { LanguageModel, StreamTextResult, UIMessage } from 'ai';
import * as fs from 'fs';
import * as path from 'path';
import { getIngredientMatchSystemPrompt } from '../lib/helper';

@Injectable()
export class AiService {
  private ingredientsData: string;

  constructor(
    @Inject('AI_MODEL')
    private readonly aiModel: LanguageModel,
  ) {
    this.loadIngredientsData();
  }

  private loadIngredientsData() {
    try {
      const csvPath = path.join(process.cwd(), 'data', 'ingredients.csv');
      this.ingredientsData = fs.readFileSync(csvPath, 'utf-8');
    } catch (error) {
      console.error('Error loading ingredients data:', error);
      this.ingredientsData = '';
    }
  }

  /**
   * Generate text using the AI model with optional image input
   * @param prompt - The text prompt
   * @param image - Optional image file as Buffer or Uint8Array
   * @returns The generated text
   */
  async generateText(prompt: string, image?: Buffer | Uint8Array) {
    try {
      const result = await generateText({
        model: this.aiModel,
        messages: [
          {
            role: 'user',
            content: image
              ? [
                  { type: 'text', text: prompt },
                  { type: 'image', image },
                ]
              : prompt,
          },
        ],
      });
      console.log(result);
      return result.text;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // Allow streaming responses up to 30 seconds

  async chat(messages: UIMessage[]): Promise<StreamTextResult<any, any>> {
    // const maxDuration = 30;

    const systemPrompt = getIngredientMatchSystemPrompt(this.ingredientsData);
    const result = streamText({
      model: this.aiModel,
      system: {
        role: 'system',
        content: systemPrompt,
      },

      messages: await convertToModelMessages(messages),
    });

    return result;
  }
}
