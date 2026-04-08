import { WhatsAppClient } from '../whatsapp/client';

export async function notifyOwnerViaWhatsApp(businessPhoneId: string, ownerPhone: string, message: string) {
   const client = new WhatsAppClient();
   await client.sendTextMessage(ownerPhone, `[System Alert]: ${message}`, businessPhoneId, process.env.META_ACCESS_TOKEN || '');
}
