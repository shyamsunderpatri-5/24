import { generateText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { INTENT_DETECTION_SYSTEM_PROMPT } from '@/prompts/intent-detection';
import { APPOINTMENT_BOOKING_SYSTEM_PROMPT } from '@/prompts/appointment-booking';
import { STOCK_INQUIRY_SYSTEM_PROMPT } from '@/prompts/stock-inquiry';
import { getAvailableSlots } from '@/lib/calendar/availability';

export type IntentType = 
  | 'BOOK_APPOINTMENT' 
  | 'CANCEL_APPOINTMENT' 
  | 'CHECK_AVAILABILITY' 
  | 'CHECK_STOCK' 
  | 'PLACE_ORDER' 
  | 'HUMAN_REQUEST' 
  | 'GREETING'
  | 'UNKNOWN';

export interface AIBrainInput {
  message: string;
  workspaceId: string;
  contactId: string;
  conversationHistory: any[];
  workspaceConfig: any;
  contactInfo: any;
}

export interface AIBrainOutput {
  reply: string;
  intent: string;
  actionTaken: string | null;
  shouldEscalateToHuman: boolean;
}

export class AIBrain {
  async processMessage(input: AIBrainInput): Promise<AIBrainOutput> {
    const { workspaceConfig, contactInfo, workspaceId, contactId } = input;
    
    const supabase = getSupabaseAdmin();

    // 1. Fetch Dynamic Prompt
    const { data: promptData } = await supabase
      .from('prompts')
      .select('content')
      .eq('workspace_id', workspaceId)
      .eq('is_default', true)
      .single();

    const systemPrompt = promptData?.content || `
You are Selvo AI, a professional AI Receptionist for ${workspaceConfig.name}.
Your goal is to help customers with their inquiries and support via WhatsApp.
Tone: Professional and helpful.
`;

    const { text } = await generateText({
      model: openai('gpt-4o'), // Support for other models can be added here
      system: systemPrompt,
      prompt: `History: ${JSON.stringify(input.conversationHistory.slice(0, 5))}\nMessage: ${input.message}`,
      maxSteps: 3,
    });

    // Basic intent detection and escalation logic can be added here or via tools
    const shouldEscalate = text.toLowerCase().includes('human') || text.toLowerCase().includes('agent');

    return {
      reply: text || "I'm sorry, I didn't quite catch that. How can I help?",
      intent: 'GENERAL',
      actionTaken: null,
      shouldEscalateToHuman: shouldEscalate
    };
  }
}

export const aiBrain = new AIBrain();
