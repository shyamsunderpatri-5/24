'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createManualAppointment(formData: {
  customerName: string;
  phone: string;
  date: string;
  time: string;
  serviceId?: string;
  staffId?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_user_id', user.id)
    .single();

  if (!business) throw new Error('Business not found');

  // 1. Find or create customer
  let { data: customer } = await supabase
    .from('customers')
    .select('id')
    .eq('business_id', business.id)
    .eq('phone', formData.phone)
    .single();

  if (!customer) {
    const { data: newCustomer } = await supabase
      .from('customers')
      .insert({
        business_id: business.id,
        phone: formData.phone,
        name: formData.customerName
      })
      .select().single();
    customer = newCustomer;
  }

  // 2. Create appointment
  const appointmentAt = new Date(`${formData.date}T${formData.time}`);
  
  const { error } = await supabase.from('appointments').insert({
    business_id: business.id,
    customer_id: customer?.id,
    service_id: formData.serviceId || null,
    staff_id: formData.staffId || null,
    appointment_at: appointmentAt.toISOString(),
    status: 'confirmed',
    source: 'manual'
  });

  if (error) throw error;

  revalidatePath('/dashboard');
  revalidatePath('/appointments');
}

export async function createManualProduct(formData: {
  name: string;
  category?: string;
  price_inr: number;
  stock_qty: number;
  unit: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_user_id', user.id)
    .single();

  if (!business) throw new Error('Business not found');

  const { error } = await supabase.from('products').insert({
    business_id: business.id,
    ...formData
  });

  if (error) throw error;

  revalidatePath('/inventory');
}

export async function createManualOrder(formData: {
  customerName: string;
  phone: string;
  items: { productId: string; qty: number }[];
  status: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_user_id', user.id)
    .single();

  if (!business) throw new Error('Business not found');

  // 1. Find or create customer
  let { data: customer } = await supabase
    .from('customers')
    .select('id')
    .eq('business_id', business.id)
    .eq('phone', formData.phone)
    .single();

  if (!customer) {
    const { data: newCustomer } = await supabase
      .from('customers')
      .insert({
        business_id: business.id,
        phone: formData.phone,
        name: formData.customerName
      })
      .select().single();
    customer = newCustomer;
  }

  // 2. Calculate totals and metadata
  const productIds = formData.items.map(i => i.productId);
  const { data: products } = await supabase.from('products').select('*').in('id', productIds);
  
  let totalInr = 0;
  const orderItems = formData.items.map(item => {
    const p = products?.find(prod => prod.id === item.productId);
    const lineTotal = (p?.price_inr || 0) * item.qty;
    totalInr += lineTotal;
    return {
      id: p?.id,
      name: p?.name,
      qty: item.qty,
      price: p?.price_inr
    };
  });

  const { error } = await supabase.from('orders').insert({
    business_id: business.id,
    customer_id: customer?.id,
    status: formData.status,
    amount_inr: totalInr,
    metadata: { items: orderItems }
  });

  if (error) throw error;

  revalidatePath('/orders');
  revalidatePath('/dashboard');
}
