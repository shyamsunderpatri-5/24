import { supabaseAdmin } from '@/lib/supabase/admin';
import { addMinutes, isBefore, parseISO, set, isAfter } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
}

export async function getAvailableSlots(
  businessId: string,
  requestedDate: Date,
  serviceId?: string,
  staffId?: string
): Promise<TimeSlot[]> {
  // 1. Get business and timezone
  const { data: business } = await supabaseAdmin.from('businesses').select('timezone').eq('id', businessId).single();
  const timezone = business?.timezone || 'Asia/Kolkata';

  // 2. Get business hours for that day
  const dayOfWeek = requestedDate.getDay(); // 0 is Sunday
  const { data: hours } = await supabaseAdmin
    .from('business_hours')
    .select('*')
    .eq('business_id', businessId)
    .eq('day_of_week', dayOfWeek)
    .single();

  if (!hours || !hours.is_open) return [];

  // Parse open time
  const [openH, openM] = hours.open_time.split(':').map(Number);
  const [closeH, closeM] = hours.close_time.split(':').map(Number);
  
  const zonedRequestedDate = toZonedTime(requestedDate, timezone);
  const startOfDay = set(zonedRequestedDate, { hours: openH, minutes: openM, seconds: 0, milliseconds: 0 });
  const endOfDay = set(zonedRequestedDate, { hours: closeH, minutes: closeM, seconds: 0, milliseconds: 0 });

  // 3. Get confirmed appointments
  const { data: appointments } = await supabaseAdmin
    .from('appointments')
    .select('appointment_at, duration_mins')
    .eq('business_id', businessId)
    .in('status', ['confirmed', 'pending'])
    .gte('appointment_at', startOfDay.toISOString())
    .lte('appointment_at', endOfDay.toISOString());

  // 4. Get service duration
  let durationMins = 30;
  if (serviceId) {
    const { data: service } = await supabaseAdmin.from('services').select('duration_mins').eq('id', serviceId).single();
    if (service) durationMins = service.duration_mins;
  }

  // 5. Generate possible slots
  const slots: TimeSlot[] = [];
  let currentSlot = startOfDay;
  const now = toZonedTime(new Date(), timezone);

  while (isBefore(addMinutes(currentSlot, durationMins), endOfDay)) {
    const slotEnd = addMinutes(currentSlot, durationMins);
    
    // Check if slot is in the past
    if (isBefore(currentSlot, now)) {
      currentSlot = addMinutes(currentSlot, 30);
      continue;
    }

    // Check overlaps with appointments
    let isAvailable = true;
    for (const appt of (appointments || [])) {
      const apptStart = parseISO(appt.appointment_at);
      const apptEnd = addMinutes(apptStart, appt.duration_mins);
      
      // If current slot overlaps with existing appointment
      if (
        (isBefore(currentSlot, apptEnd) && isAfter(slotEnd, apptStart)) ||
        currentSlot.getTime() === apptStart.getTime()
      ) {
        isAvailable = false;
        break;
      }
    }

    if (isAvailable) {
      slots.push({
        start: currentSlot,
        end: slotEnd,
        available: true
      });
    }

    // Move next
    currentSlot = addMinutes(currentSlot, 30);
  }

  // Return next 5 available
  return slots.slice(0, 5);
}
