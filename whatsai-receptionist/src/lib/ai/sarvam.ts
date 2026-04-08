interface SarvamSTTResponse {
  transcript: string;
  language: string;
}

export class SarvamAI {
  private apiKey: string;
  private baseUrl = 'https://api.sarvam.ai';

  constructor() {
    this.apiKey = process.env.SARVAM_API_KEY || '';
  }

  // Transcribe Voice Note to Text
  async speechToText(audioBuffer: Buffer, mimeType: string): Promise<SarvamSTTResponse> {
    const formData = new FormData();
    const blob = new Blob([new Uint8Array(audioBuffer)], { type: mimeType });
    formData.append('file', blob, 'audio.ogg');
    
    // In production we would specify prompt or language hints per Sarvam docs
    const res = await fetch(`${this.baseUrl}/speech-to-text/translate`, {
      method: 'POST',
      headers: {
        'API-Key': this.apiKey
      },
      body: formData
    });

    if (!res.ok) {
      throw new Error(`Sarvam STT failed: ${res.statusText}`);
    }

    const data = await res.json();
    return {
      transcript: data.transcript,
      language: data.language_code || 'hi'
    };
  }

  // Uses Sarvam's LLM if available, otherwise can fallback to OpenAI. Here we define basic fetch.
  async generateText(prompt: string, systemMessage?: string): Promise<string> {
    const res = await fetch(`${this.baseUrl}/text-generation`, {
      method: 'POST',
      headers: {
        'API-Key': this.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          ...(systemMessage ? [{ role: 'system', content: systemMessage }] : []),
          { role: 'user', content: prompt }
        ],
        model: 'sarvam-2b' // placeholder for actual Sarvam model
      })
    });

    if (!res.ok) {
      throw new Error(`Sarvam TextGen failed: ${res.statusText}`);
    }

    const data = await res.json();
    return data.choices[0].message.content;
  }
}

export const sarvamAI = new SarvamAI();
