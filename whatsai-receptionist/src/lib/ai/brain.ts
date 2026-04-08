import { generateText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase/admin';
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
  businessId: string;
  customerId: string;
  conversationHistory: any[];
  businessConfig: any;
  customerInfo: any;
}

export interface AIBrainOutput {
  reply: string;
  intent: IntentType;
  entitiesExtracted: Record<string, unknown>;
  actionTaken: string | null;
  shouldNotifyOwner: boolean;
  shouldEscalateToHuman: boolean;
}

export class AIBrain {
  async processMessage(input: AIBrainInput): Promise<AIBrainOutput> {
    const { businessConfig, customerInfo, businessId, customerId } = input;
    
    const systemMessage = `
You are Selvo AI, a professional AI Receptionist for {businessName}, a {businessType} based in India.
Your goal is to help customers with their inquiries, bookings, and orders via WhatsApp.

Tone: Professional, helpful, and concise. Use Hinglish (Hindi + English) or English as appropriate for an Indian audience.
Guidelines:
1. Always confirm availability before booking.
2. If the user wants to buy something, create an order first.
3. If a payment link is generated, present it clearly to the user.
4. If you cannot help or the request is complex, escalate to the human owner.
`.replace('{businessType}', businessConfig.type).replace('{businessName}', businessConfig.name);

    let actionTaken: string | null = null;
    let finalIntent: IntentType = 'UNKNOWN';

    const { text } = await generateText({
      model: openai('gpt-4o'),
      system: systemMessage,
      prompt: `History: ${JSON.stringify(input.conversationHistory.slice(0, 5))}\nMessage: ${input.message}`,
      maxSteps: 5,
      tools: {
        checkAvailability: tool({
          description: 'Check available slots for a specific date.',
          parameters: z.object({
            date: z.string().describe('YYYY-MM-DD format'),
            serviceName: z.string().optional(),
            staffName: z.string().optional()
          }),
          execute: async ({ date, serviceName, staffName }: { date: string, serviceName?: string, staffName?: string }) => {
            let serviceId = undefined;
            let staffId = undefined;

            if (serviceName) {
              const { data: svc } = await supabaseAdmin.from('services').select('id').eq('business_id', businessId).ilike('name', `%${serviceName}%`).single();
              serviceId = svc?.id;
            }
            if (staffName) {
              const { data: stf } = await supabaseAdmin.from('staff').select('id').eq('business_id', businessId).ilike('name', `%${staffName}%`).single();
              staffId = stf?.id;
            }

            const slots = await getAvailableSlots(businessId, new Date(date), serviceId, staffId);
            finalIntent = 'CHECK_AVAILABILITY';
            return { slots };
          }
        }),
        bookAppointment: tool({
          description: 'Book an appointment once the customer confirms a slot.',
          parameters: z.object({
            date: z.string().describe('YYYY-MM-DD'),
            time: z.string().describe('HH:MM'),
            serviceName: z.string().optional(),
            staffName: z.string().optional()
          }),
          execute: async ({ date, time, serviceName, staffName }: { date: string, time: string, serviceName?: string, staffName?: string }) => {
            let serviceId = null;
            let staffId = null;

            if (serviceName) {
              const { data: svc } = await supabaseAdmin.from('services').select('id').eq('business_id', businessId).ilike('name', `%${serviceName}%`).single();
              serviceId = svc?.id;
            }
            if (staffName) {
              const { data: stf } = await supabaseAdmin.from('staff').select('id').eq('business_id', businessId).ilike('name', `%${staffName}%`).single();
              staffId = stf?.id;
            }

            const appointmentAt = new Date(`${date}T${time}:00`);
            const { data: newAppt } = await supabaseAdmin.from('appointments').insert({
              business_id: businessId,
              customer_id: customerId,
              service_id: serviceId,
              staff_id: staffId,
              appointment_at: appointmentAt.toISOString(),
              status: 'confirmed',
              source: 'whatsapp'
            }).select().single();
            
            actionTaken = 'booked_appointment';
            finalIntent = 'BOOK_APPOINTMENT';
            return { success: true, appointmentId: newAppt?.id };
          }
        }),
        checkStock: tool({
          description: 'Check if a product is in stock (for kirana/medical stores).',
          parameters: z.object({
            productName: z.string()
          }),
          execute: async ({ productName }: { productName: string }) => {
            const { data: products } = await supabaseAdmin
              .from('products')
              .select('*')
              .eq('business_id', businessId)
              .ilike('name', `%${productName}%`);
            
            finalIntent = 'CHECK_STOCK';
            return { products: products || [] };
          }
        }),
        placeOrder: tool({
          description: 'Create an order item in the system when a customer wants to buy something.',
          parameters: z.object({
            productName: z.string(),
            quantity: z.number().default(1),
            notes: z.string().optional()
          }),
          execute: async ({ productName, quantity, notes }: { productName: string, quantity: number, notes?: string }) => {
            const { data: product } = await supabaseAdmin
              .from('products')
              .select('*')
              .eq('business_id', businessId)
              .ilike('name', `%${productName}%`)
              .single();
            
            if (!product) return { error: 'Product not found' };

            const { data: order } = await supabaseAdmin
              .from('orders')
              .insert({
                business_id: businessId,
                customer_id: customerId,
                status: 'pending',
                amount_inr: product.price_inr * quantity,
                metadata: { items: [{ id: product.id, name: product.name, qty: quantity }], notes }
              })
              .select()
              .single();

            actionTaken = 'placed_order';
            finalIntent = 'PLACE_ORDER';
            return { success: true, orderId: order?.id };
          }
        }),
        generatePaymentLink: tool({
          description: 'Generate a Razorpay UPI payment link for the customer.',
          parameters: z.object({
            amount: z.number().describe('Amount in INR'),
            reason: z.string().describe('Payment for what?')
          }),
          execute: async ({ amount, reason }: { amount: number, reason: string }) => {
            const { createPaymentLink } = await import('@/lib/payments/razorpay');
            const link = await createPaymentLink({
              amount,
              description: `Payment for ${reason} to ${businessConfig.name}`,
              customer: {
                name: customerInfo?.name || 'Customer',
                contact: customerInfo?.phone
              },
              businessId: businessId,
              referenceId: `WA_${Date.now()}`
            });
            
            actionTaken = 'generated_payment_link';
            return { success: true, paymentLink: link };
          }
        }),
        escalateToHuman: tool({
          description: 'Call this if the user wants to talk to a person or if the request is too complex.',
          parameters: z.object({ reason: z.string() }),
          execute: async ({ reason }: { reason: string }) => {
            finalIntent = 'HUMAN_REQUEST';
            actionTaken = 'human_escalated';
            return { escalated: true };
          }
        })
      }
    });

    return {
      reply: text || "Main aapki kaise madad kar sakta hoon?",
      intent: finalIntent,
      entitiesExtracted: {},
      actionTaken,
      shouldNotifyOwner: (finalIntent as string) === 'HUMAN_REQUEST' || actionTaken === 'human_escalated',
      shouldEscalateToHuman: (finalIntent as string) === 'HUMAN_REQUEST'
    };
  }
}

export const aiBrain = new AIBrain();
