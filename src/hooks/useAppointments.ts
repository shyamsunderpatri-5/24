import { useState, useEffect } from 'react';

export function useAppointments(businessId: string) {
  const [appointments, setAppointments] = useState([]);
  
  useEffect(() => {
    fetch('/api/appointments').then(res => res.json()).then(setAppointments);
  }, [businessId]);
  
  return { appointments };
}
