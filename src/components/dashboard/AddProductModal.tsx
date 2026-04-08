'use client'

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { createManualProduct } from '@/app/(dashboard)/actions';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price_inr: 0,
    stock_qty: 0,
    unit: 'pcs',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createManualProduct(formData);
      onClose();
    } catch (err) {
      alert('Error creating product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Product">
      <form onSubmit={handleSubmit} className="space-y-4 text-slate-700">
        <div>
          <label className="text-sm font-semibold mb-1 block">Product Name</label>
          <input 
            required
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            placeholder="e.g. Paracetamol 500mg"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold mb-1 block">Category</label>
            <input 
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
              placeholder="e.g. Medicine"
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1 block">Unit</label>
            <input 
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
              value={formData.unit}
              onChange={e => setFormData({...formData, unit: e.target.value})}
              placeholder="e.g. strip / kg"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold mb-1 block">Price (INR)</label>
            <input 
              required
              type="number"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
              value={formData.price_inr}
              onChange={e => setFormData({...formData, price_inr: Number(e.target.value)})}
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1 block">Initial Stock</label>
            <input 
              required
              type="number"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
              value={formData.stock_qty}
              onChange={e => setFormData({...formData, stock_qty: Number(e.target.value)})}
            />
          </div>
        </div>

        <button 
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition"
        >
          {loading ? 'Adding...' : 'Add to Inventory'}
        </button>
      </form>
    </Modal>
  );
}
