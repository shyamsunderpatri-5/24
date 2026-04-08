export function getISTNow(): Date {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const istOffset = 5.5 * 60 * 60 * 1000;
  return new Date(utc + istOffset);
}

export function formatIST(date: Date): string {
  return date.toISOString().replace('T', ' ').substring(0, 16);
}
