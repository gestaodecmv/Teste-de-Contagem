
import React from 'react';
import { InventoryRecord, Product } from '../types';
import { exportToExcel } from '../services/excelService';

interface InventoryHistoryProps {
  history: InventoryRecord[];
  products: Product[];
  onDelete: (id: string) => void;
  onEdit: (record: InventoryRecord) => void;
}

export const InventoryHistory: React.FC<InventoryHistoryProps> = ({ 
  history, 
  products, 
  onDelete, 
  onEdit 
}) => {
  const handleExport = (record: InventoryRecord) => {
    exportToExcel(record, products);
  };

  const confirmDelete = (id: string) => {
    if (window.confirm("CRITICAL ACTION: This action is irreversible. Are you sure you want to PERMANENTLY delete this inventory record?")) {
      onDelete(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Inventory History & Audit</h2>
          <p className="text-slate-500 text-sm">Review past counts and export reports.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Responsible</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Last Edited</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-400 italic">No inventory history recorded yet.</td>
                </tr>
              ) : (
                history.map(record => (
                  <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-indigo-700">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-slate-700">{record.responsible}</td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {new Date(record.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {record.updatedAt ? new Date(record.updatedAt).toLocaleString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleExport(record)}
                          className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-sm font-semibold transition flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Excel
                        </button>
                        <button 
                          onClick={() => onEdit(record)}
                          className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-sm font-semibold transition"
                        >
                          Reopen
                        </button>
                        <button 
                          onClick={() => confirmDelete(record.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
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
