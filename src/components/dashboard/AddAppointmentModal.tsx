'use client'

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { createManualAppointment } from '@/app/(dashboard)/actions';

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: any[];
}

export function AddAppointmentModal({ isOpen, onClose, services }: AddAppointmentModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    serviceId: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createManualAppointment(formData);
      onClose();
    } catch (err) {
      alert('Error creating appointment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Manual Booking">
      <form onSubmit={handleSubmit} className="space-y-4 text-slate-700">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold mb-1 block">Customer Name</label>
            <input 
              required
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
              value={formData.customerName}
              onChange={e => setFormData({...formData, customerName: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1 block">Phone Number</label>
            <input 
              required
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>
        </div>

        <div>
           <label className="text-sm font-semibold mb-1 block">Service</label>
           <select 
             className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
             value={formData.serviceId}
             onChange={e => setFormData({...formData, serviceId: e.target.value})}
           >
             <option value="">General Consulting</option>
             {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
           </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold mb-1 block">Date</label>
            <input 
              required
              type="date"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
              value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1 block">Time</label>
            <input 
              required
              type="time"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
              value={formData.time}
              onChange={e => setFormData({...formData, time: e.target.value})}
            />
          </div>
        </div>

        <button 
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition"
        >
          {loading ? 'Saving...' : 'Confirm Appointment'}
        </button>
      </form>
    </Modal>
  );
}
