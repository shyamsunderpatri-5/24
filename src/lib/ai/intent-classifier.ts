import { askOpenAI } from './openai';
import { INTENT_DETECTION_SYSTEM_PROMPT } from '@/prompts/system-prompts';

export async function classifyIntent(message: string, businessData: any) {
  const systemPrompt = INTENT_DETECTION_SYSTEM_PROMPT
     .replace('{businessType}', businessData.type || 'business')
     .replace('{businessName}', businessData.name || 'business');
     
  const result = await askOpenAI(systemPrompt, message);
  try {
     return JSON.parse(result);
  } catch (e) {
     return { intent: 'UNKNOWN', confidence: 0 };
  }
}
