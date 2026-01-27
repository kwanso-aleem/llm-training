import { Inject, Injectable } from '@nestjs/common';
import { convertToModelMessages, generateText, streamText } from 'ai';
import type { LanguageModel, StreamTextResult, UIMessage } from 'ai';
import * as fs from 'fs';
import * as path from 'path';

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

    const systemPrompt = `You are an ingredient matching assistant for supplement fact sheets.

Your task is to analyze supplement fact sheet inputs and suggest the correct ingredient from the ingredients database.

When you receive a supplement fact sheet with ingredient information, you should:
1. Look at the ingredient latinName, name and scientificName provided
2. Search through the ingredients database to find the best match
3. Return the matched ingredient with the following information:
   - name: The full ingredient name from the database
   - category: The category of the ingredient
   - scientificName: The scientific name of the ingredient
   - latinName: The latin name of the ingredient
   - ingredientProductTypes: The product types this ingredient can be used in
   - potency: The potency of the ingredient

The ingredients database is in CSV format with the following structure:
- category: Main category of the ingredient
- subCategory: Subcategory
- name: Full ingredient name
- scientificName: Scientific name
- latinName: Latin name with standardization info
- tradeMarkName: Brand/trade name
- ingredientProductTypes: Where it can be used (C=Capsule, T=Tablet, P=Powder, G=Gummy)

Important matching guidelines:
- Be flexible with ingredient name matching (e.g., "htp-5", "5-HTP", "5-hydroxytryptophan" should all match)
- Look for similar names, abbreviations, or scientific names
- If multiple matches are found, return ALL relevant matches and let the user select
- Pay attention to standardization percentages if mentioned in the input
- Consider variations in potency, forms, or sources as separate suggestions

Here is the ingredients database:

${this.ingredientsData}

When responding, format your suggestions as JSON with the following structure:

For single match:
{
  "suggestions": [
    {
      "name": "ingredient name",
      "category": "category",
      "scientificName": "scientific name",
      "latinName": "label name",
      "ingredientProductTypes": "C,T,P,G",
      "potency": "potency",
    }
  ]
}

For multiple matches:
{
  "suggestions": [
    {
      "name": "ingredient name 1",
      "category": "category",
      "scientificName": "scientific name",
      "latinName": "label name",
      "ingredientProductTypes": "C,T,P,G",
      "potency": "potency",
    },
    {
      "name": "ingredient name 2",
      "category": "category",
      "scientificName": "scientific name",
      "latinName": "label name",
      "ingredientProductTypes": "C,T,P,G",
      "potency": "potency",
    }
  ]
}

Always return suggestions as an array, even if there's only one match. If no match is found, return an empty array and provide an explanation.`;

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
