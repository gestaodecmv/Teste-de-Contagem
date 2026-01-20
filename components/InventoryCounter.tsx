
import React, { useState, useEffect } from 'react';
import { Product, InventoryRecord, InventoryItem } from '../types';

interface InventoryCounterProps {
  products: Product[];
  onSave: (record: InventoryRecord) => void;
  history: InventoryRecord[];
  editRecord: InventoryRecord | null;
  onCancelEdit: () => void;
}

export const InventoryCounter: React.FC<InventoryCounterProps> = ({ 
  products, 
  onSave, 
  history, 
  editRecord,
  onCancelEdit
}) => {
  const [responsible, setResponsible] = useState(editRecord?.responsible || '');
  const [date, setDate] = useState(editRecord?.date || new Date().toISOString().split('T')[0]);
  const [counts, setCounts] = useState<Record<string, { boxes: number, packs: number, units: number }>>({});

  useEffect(() => {
    if (editRecord) {
      const initialCounts: Record<string, any> = {};
      editRecord.items.forEach(item => {
        initialCounts[item.productId] = {
          boxes: item.boxes,
          packs: item.packs,
          units: item.units
        };
      });
      setCounts(initialCounts);
      setResponsible(editRecord.responsible);
      setDate(editRecord.date);
    } else {
      // Initialize with zeros for all active products
      const initialCounts: Record<string, any> = {};
      products.forEach(p => {
        initialCounts[p.id] = { boxes: 0, packs: 0, units: 0 };
      });
      setCounts(initialCounts);
    }
  }, [editRecord, products]);

  const handleCountChange = (productId: string, field: 'boxes' | 'packs' | 'units', value: string) => {
    const numValue = parseFloat(value) || 0;
    if (numValue < 0) return; // Business rule: no negatives

    setCounts(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: numValue
      }
    }));
  };

  const calculateTotal = (product: Product) => {
    const c = counts[product.id] || { boxes: 0, packs: 0, units: 0 };
    const total = (c.boxes * product.factorBox) + 
                  (c.packs * product.factorPack) + 
                  (c.units * product.factorUnit);
    return total;
  };

  const handleFinalSave = () => {
    // Validations
    if (!responsible.trim()) {
      alert("Validation Error: Name of responsible person is required.");
      return;
    }

    if (!date) {
      alert("Validation Error: Inventory date is required.");
      return;
    }

    // Check for duplicate date (unless editing existing record with same date)
    const duplicateDate = history.find(h => h.date === date && h.id !== editRecord?.id);
    if (duplicateDate) {
      alert(`Validation Error: An inventory already exists for the date ${new Date(date).toLocaleDateString()}. Duplicate dates are not allowed.`);
      return;
    }

    const inventoryItems: InventoryItem[] = products.map(p => {
      const c = counts[p.id] || { boxes: 0, packs: 0, units: 0 };
      return {
        productId: p.id,
        boxes: c.boxes,
        packs: c.packs,
        units: c.units,
        totalConsolidated: calculateTotal(p)
      };
    });

    const now = new Date().toISOString();
    const record: InventoryRecord = {
      id: editRecord?.id || crypto.randomUUID(),
      date,
      responsible,
      items: inventoryItems,
      createdAt: editRecord?.createdAt || now,
      updatedAt: editRecord ? now : undefined
    };

    onSave(record);
  };

  if (products.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 p-8 rounded-xl text-center">
        <p className="text-amber-800 font-medium">No active products found to count.</p>
        <p className="text-amber-600 text-sm mt-1">Please register and activate products first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {editRecord ? 'Editing Inventory Count' : 'New Inventory Count'}
          </h2>
          <p className="text-slate-500 text-sm">Enter the physical quantities found in the warehouse.</p>
        </div>
        <div className="flex gap-3">
          {editRecord && (
            <button 
              onClick={onCancelEdit}
              className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-100 transition font-medium"
            >
              Cancel Edit
            </button>
          )}
          <button 
            onClick={handleFinalSave}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-bold shadow-md"
          >
            {editRecord ? 'Save Changes' : 'Complete Inventory'}
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase">Responsible Person *</label>
          <input 
            required
            className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={responsible}
            onChange={e => setResponsible(e.target.value)}
            placeholder="Name of the person performing the count"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase">Inventory Date *</label>
          <input 
            type="date"
            required
            className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Boxes</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Packs</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Loose Units</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Consolidated Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map(product => {
                const c = counts[product.id] || { boxes: 0, packs: 0, units: 0 };
                return (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{product.name}</div>
                      <div className="text-xs text-slate-500">Code: {product.code} | Unit: {product.unit}</div>
                    </td>
                    <td className="px-6 py-4">
                      <input 
                        type="number" step="0.001"
                        className="w-24 border border-slate-200 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={c.boxes || ''}
                        onChange={e => handleCountChange(product.id, 'boxes', e.target.value)}
                        placeholder="0"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input 
                        type="number" step="0.001"
                        className="w-24 border border-slate-200 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={c.packs || ''}
                        onChange={e => handleCountChange(product.id, 'packs', e.target.value)}
                        placeholder="0"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <input 
                          type="number" step="0.001"
                          className="w-32 border border-slate-200 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                          value={c.units || ''}
                          onChange={e => handleCountChange(product.id, 'units', e.target.value)}
                          placeholder="0.000"
                        />
                        <span className="text-xs text-slate-400 font-medium">{product.unit}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">
                        {calculateTotal(product).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })} {product.unit}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
