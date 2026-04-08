interface Button {
  type: string;
  reply: { id: string; title: string; };
}

interface Section {
  title: string;
  rows: { id: string; title: string; description?: string; }[];
}

export class WhatsAppClient {
  private apiVersion = 'v17.0';
  private baseUrl = `https://graph.facebook.com/${this.apiVersion}`;

  // Send text message
  async sendTextMessage(to: string, text: string, businessPhoneNumberId: string, accessToken: string): Promise<void> {
    const url = `${this.baseUrl}/${businessPhoneNumberId}/messages`;
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: { body: text }
    };
    
    await this.fetchWithRetry(url, payload, accessToken);
  }

  // Send interactive message (buttons)
  async sendButtonMessage(to: string, body: string, buttons: Button[], businessPhoneNumberId: string, accessToken: string): Promise<void> {
    const url = `${this.baseUrl}/${businessPhoneNumberId}/messages`;
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'interactive',
      interactive: {
        type: 'button',
        body: { text: body },
        action: { buttons }
      }
    };
    
    await this.fetchWithRetry(url, payload, accessToken);
  }

  // Send list message
  async sendListMessage(to: string, header: string, sections: Section[], businessPhoneNumberId: string, accessToken: string): Promise<void> {
    const url = `${this.baseUrl}/${businessPhoneNumberId}/messages`;
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'interactive',
      interactive: {
        type: 'list',
        header: { type: 'text', text: header },
        body: { text: 'Please choose an option:' },
        action: {
          button: 'Select',
          sections
        }
      }
    };
    
    await this.fetchWithRetry(url, payload, accessToken);
  }

  // Download media
  async downloadMedia(mediaId: string, accessToken: string): Promise<Buffer> {
    const url = `${this.baseUrl}/${mediaId}`;
    const response = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
    if (!response.ok) throw new Error(`Failed to get media url for ${mediaId}`);
    
    const data = await response.json();
    const mediaUrl = data.url;
    
    const mediaResponse = await fetch(mediaUrl, { headers: { Authorization: `Bearer ${accessToken}` } });
    if (!mediaResponse.ok) throw new Error(`Failed to download media ${mediaId}`);
    const arrayBuffer = await mediaResponse.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  // Mark message as read
  async markAsRead(messageId: string, businessPhoneNumberId: string, accessToken: string): Promise<void> {
    const url = `${this.baseUrl}/${businessPhoneNumberId}/messages`;
    const payload = {
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageId
    };
    await this.fetchWithRetry(url, payload, accessToken);
  }
  
  private async fetchWithRetry(url: string, payload: any, accessToken: string, retries = 3): Promise<void> {
    for (let i = 0; i < retries; i++) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify(payload)
        });
        if (res.ok) return;
        if (res.status >= 500) continue; // retry on 5xx
        const errorText = await res.text();
        throw new Error(`WhatsApp API Error: ${res.status} ${errorText}`);
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(r => setTimeout(r, 1000 * (i + 1))); // backoff
      }
    }
  }
}

export const whatsappClient = new WhatsAppClient();
