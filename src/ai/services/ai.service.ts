import { Inject, Injectable } from '@nestjs/common';
import { convertToModelMessages, generateText, streamText } from 'ai';
import type { LanguageModel, StreamTextResult, UIMessage } from 'ai';

@Injectable()
export class AiService {
  constructor(
    @Inject('AI_MODEL')
    private readonly aiModel: LanguageModel,
  ) {}

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

    const result = streamText({
      model: this.aiModel,
      system: 'You are a helpful assistant.',
      messages: await convertToModelMessages(messages),
    });

    return result;
  }
}
