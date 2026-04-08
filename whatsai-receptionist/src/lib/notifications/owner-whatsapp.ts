import { WhatsAppClient } from '../whatsapp/client';

export async function notifyOwnerViaWhatsApp(businessPhoneId: string, ownerPhone: string, message: string) {
   const client = new WhatsAppClient(process.env.META_ACCESS_TOKEN || '');
   await client.sendTextMessage(ownerPhone, `[System Alert]: ${message}`, businessPhoneId);
}
