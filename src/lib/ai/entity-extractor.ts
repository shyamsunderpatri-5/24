import { askOpenAI } from './openai';

export async function extractEntities(message: string, intent: string) {
  const systemPrompt = `Extract entities from this message based on the intent: ${intent}. Return ONLY a raw JSON mapping with keys like date, time, service_name, product_name, quantity, customer_name based on what is relevant for the intent.`;
  const result = await askOpenAI(systemPrompt, message);
  try {
     return JSON.parse(result);
  } catch(e) {
     return {};
  }
}
