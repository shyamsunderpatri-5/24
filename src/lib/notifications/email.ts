export async function sendOwnerEmail(to: string, subject: string, bodyText: string) {
  if (!process.env.RESEND_API_KEY) return;
  
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: process.env.FROM_EMAIL || 'noreply@whatsai.in',
      to: [to],
      subject,
      text: bodyText
    })
  });
}
