export interface WhatsAppMessage {
  from: string;
  id: string;
  timestamp: string;
  text?: { body: string };
  type: string;
}

export interface WhatsAppWebhookPayload {
  object: string;
  entry: [{
    changes: [{
      value: {
        messages?: WhatsAppMessage[];
        metadata: { display_phone_number: string; phone_number_id: string };
      }
    }]
  }];
}
