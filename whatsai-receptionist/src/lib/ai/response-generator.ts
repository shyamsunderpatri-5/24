import { askOpenAI } from './openai';
import { BOOKING_SYSTEM_PROMPT } from '@/prompts/system-prompts';

export async function generateResponse(
  message: string,
  context: any,
  businessData: any
) {
  const prompt = BOOKING_SYSTEM_PROMPT
     .replace('{businessName}', businessData.name || 'Business')
     .replace('{businessType}', businessData.type || '')
     .replace('{servicesList}', JSON.stringify(businessData.services || []))
     .replace('{businessHours}', JSON.stringify(businessData.hours || []))
     .replace('{address}', businessData.address || '')
     .replace('{upiId}', businessData.upi_id || '');

  return askOpenAI(prompt, `Context: ${JSON.stringify(context)}\nUser said: ${message}`);
}
