import crypto from 'crypto';

export interface WebhookPayload {
  object: string;
  entry: {
    id: string;
    changes: {
      value: {
        messaging_product: string;
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        contacts?: { profile: { name: string; }; wa_id: string; }[];
        messages?: WAIncomingMessage[];
        statuses?: WAIncomingStatus[];
      };
      field: string;
    }[];
  }[];
}

export interface WAIncomingMessage {
  from: string;
  id: string;
  timestamp: string;
  type: 'text' | 'audio' | 'image' | 'interactive' | 'document' | 'unsupported';
  text?: { body: string; };
  audio?: { id: string; mime_type: string; };
  image?: { id: string; mime_type: string; };
  interactive?: {
    type: 'button_reply' | 'list_reply';
    button_reply?: { id: string; title: string; };
    list_reply?: { id: string; title: string; description: string; };
  };
}

export interface WAIncomingStatus {
  id: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
  recipient_id: string;
}

export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;
  const appSecret = process.env.META_APP_SECRET;
  if (!appSecret) return false;
  
  const expectedSig = crypto.createHmac('sha256', appSecret).update(rawBody).digest('hex');
  const actualSig = signature.replace('sha256=', '');
  
  // Constant time comparison
  if (expectedSig.length !== actualSig.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expectedSig), Buffer.from(actualSig));
}

export function parseMessages(payload: WebhookPayload) {
  const extracted = [];
  if (payload.object === 'whatsapp_business_account' && payload.entry) {
    for (const entry of payload.entry) {
      if (entry.changes) {
        for (const change of entry.changes) {
          if (change.value && change.value.messages) {
            for (const message of change.value.messages) {
              const customerName = change.value.contacts?.[0]?.profile?.name || 'Unknown';
              extracted.push({
                phoneNumberId: change.value.metadata.phone_number_id,
                message,
                customerName
              });
            }
          }
        }
      }
    }
  }
  return extracted;
}
