'use client'

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { createManualOrder } from '@/app/(dashboard)/actions';

interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: any[];
}

export function AddOrderModal({ isOpen, onClose, products }: AddOrderModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    items: [{ productId: '', qty: 1 }],
    status: 'completed',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.items.some(i => !i.productId)) return alert('Please select a product');
    
    setLoading(true);
    try {
      await createManualOrder(formData);
      onClose();
    } catch (err) {
      alert('Error creating order');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => setFormData({ ...formData, items: [...formData.items, { productId: '', qty: 1 }] });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Manual Sale">
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

        <div className="space-y-2">
          <label className="text-sm font-semibold block">Items</label>
          {formData.items.map((item, idx) => (
            <div key={idx} className="flex gap-2">
              <select 
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                value={item.productId}
                onChange={e => {
                  const newItems = [...formData.items];
                  newItems[idx].productId = e.target.value;
                  setFormData({...formData, items: newItems});
                }}
              >
                <option value="">Select Product...</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name} (₹{p.price_inr})</option>)}
              </select>
              <input 
                type="number"
                className="w-20 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                value={item.qty}
                onChange={e => {
                  const newItems = [...formData.items];
                  newItems[idx].qty = Number(e.target.value);
                  setFormData({...formData, items: newItems});
                }}
              />
            </div>
          ))}
          <button type="button" onClick={addItem} className="text-sm text-blue-600 font-medium">+ Add another item</button>
        </div>

        <button 
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition"
        >
          {loading ? 'Saving...' : 'Complete Sale'}
        </button>
      </form>
    </Modal>
  );
}
