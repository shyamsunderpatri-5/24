export interface Business {
  id: string;
  name: string;
  type: string;
  whatsapp_number: string;
  created_at: string;
}

export interface Appointment {
  id: string;
  business_id: string;
  customer_id: string;
  appointment_at: string;
  status: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  content: string;
  direction: 'inbound' | 'outbound';
  sent_at: string;
}
