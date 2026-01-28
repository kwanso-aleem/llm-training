import * as fs from 'fs';
import * as path from 'path';
import { Inject, Injectable } from '@nestjs/common';
import { convertToModelMessages, streamText } from 'ai';
import type { LanguageModel, StreamTextResult, UIMessage } from 'ai';
// helpers
import { getIngredientMatchSystemPrompt } from '../lib/helper';
// constants
import { AppProviders } from '../lib/constants';

@Injectable()
export class AiService {
  private ingredientsData: string;

  constructor(
    @Inject(AppProviders.AI_MODEL)
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
