
import React, { useState } from 'react';
import { Product, UnitType, ProductStatus } from '../types';

interface ProductManagerProps {
  products: Product[];
  onUpdate: (products: Product[]) => void;
}

export const ProductManager: React.FC<ProductManagerProps> = ({ products, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    code: '',
    name: '',
    category: '',
    unit: UnitType.UN,
    factorBox: 0,
    factorPack: 0,
    factorUnit: 1,
    status: ProductStatus.ACTIVE
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation: Duplicate Code
    const duplicate = products.find(p => p.code === formData.code && p.id !== editingId);
    if (duplicate) {
      alert("Error: A product with this code already exists.");
      return;
    }

    if (editingId) {
      onUpdate(products.map(p => p.id === editingId ? { ...formData, id: editingId } : p));
    } else {
      onUpdate([...products, { ...formData, id: crypto.randomUUID() }]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      category: '',
      unit: UnitType.UN,
      factorBox: 0,
      factorPack: 0,
      factorUnit: 1,
      status: ProductStatus.ACTIVE
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (product: Product) => {
    setFormData({ ...product });
    setEditingId(product.id);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      onUpdate(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Product Registration</h2>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add New Product
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Material Code *</label>
              <input 
                required
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g. MAT-001"
              />
            </div>
            <div className="space-y-1 lg:col-span-2">
              <label className="text-xs font-semibold text-slate-500 uppercase">Product Name *</label>
              <input 
                required
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Item description"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Category</label>
              <input 
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Standard Unit *</label>
              <select 
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.unit}
                onChange={e => setFormData({ ...formData, unit: e.target.value as UnitType })}
              >
                <option value={UnitType.UN}>UN (Unit)</option>
                <option value={UnitType.KG}>KG (Kilogram)</option>
                <option value={UnitType.L}>L (Liter)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Qty per Box</label>
              <input 
                type="number" step="0.001"
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.factorBox}
                onChange={e => setFormData({ ...formData, factorBox: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Qty per Pack</label>
              <input 
                type="number" step="0.001"
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.factorPack}
                onChange={e => setFormData({ ...formData, factorPack: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Factor Unit</label>
              <input 
                type="number" step="0.001"
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.factorUnit}
                onChange={e => setFormData({ ...formData, factorUnit: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Status</label>
              <select 
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as ProductStatus })}
              >
                <option value={ProductStatus.ACTIVE}>Active</option>
                <option value={ProductStatus.INACTIVE}>Inactive</option>
              </select>
            </div>
            <div className="lg:col-span-4 flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button 
                type="button" 
                onClick={resetForm}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                {editingId ? 'Update Product' : 'Save Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Unit</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Factors (B/P/U)</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-400 italic">No products registered yet.</td>
                </tr>
              ) : (
                products.map(product => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-700">{product.code}</td>
                    <td className="px-6 py-4 text-slate-600">{product.name}</td>
                    <td className="px-6 py-4 text-slate-500">{product.category || '-'}</td>
                    <td className="px-6 py-4 text-slate-600">{product.unit}</td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {product.factorBox} / {product.factorPack} / {product.factorUnit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        product.status === ProductStatus.ACTIVE ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(product)}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
