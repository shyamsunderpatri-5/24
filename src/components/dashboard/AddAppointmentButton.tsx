'use client'

import { useState } from 'react';
import { AddAppointmentModal } from './AddAppointmentModal';

export function AddAppointmentButton({ services }: { services: any[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
      >
        + Add Manual Booking
      </button>
      <AddAppointmentModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        services={services} 
      />
    </>
  );
}
