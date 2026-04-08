import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function askOpenAI(systemPrompt: string, userPrompt: string) {
  const { text } = await generateText({
    model: openai('gpt-4o-mini'),
    system: systemPrompt,
    prompt: userPrompt,
  });
  return text;
}
