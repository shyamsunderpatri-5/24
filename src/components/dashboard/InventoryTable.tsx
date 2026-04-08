export function InventoryTable() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
      <h3 className="font-bold text-slate-800 mb-6 text-lg">Stock Management</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400">
              <th className="pb-3 font-semibold">Item Name</th>
              <th className="pb-3 font-semibold">Stock Qty</th>
              <th className="pb-3 font-semibold">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition">
              <td className="py-4 font-medium text-slate-800">Paracetamol 500mg</td>
              <td className="py-4 text-red-500 font-bold bg-red-50/50 rounded-lg px-2 w-[80px]">2 Boxes</td>
              <td className="py-4 font-medium">₹50.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
