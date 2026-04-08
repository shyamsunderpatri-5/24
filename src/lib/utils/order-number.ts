export function generateOrderNumber(): string {
  const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const randomStr = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${dateStr}-${randomStr}`;
}
