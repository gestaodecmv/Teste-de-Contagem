
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ProductManager } from './components/ProductManager';
import { InventoryCounter } from './components/InventoryCounter';
import { InventoryHistory } from './components/InventoryHistory';
import { View, Product, InventoryRecord } from './types';
import { loadProducts, loadHistory, saveProducts, saveHistory } from './services/storageService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('counting');
  const [products, setProducts] = useState<Product[]>([]);
  const [history, setHistory] = useState<InventoryRecord[]>([]);
  const [editingInventory, setEditingInventory] = useState<InventoryRecord | null>(null);

  // Initialize data
  useEffect(() => {
    setProducts(loadProducts());
    setHistory(loadHistory());
  }, []);

  const handleUpdateProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    saveProducts(newProducts);
  };

  const handleSaveInventory = (record: InventoryRecord) => {
    const existingIndex = history.findIndex(h => h.id === record.id);
    let newHistory: InventoryRecord[];

    if (existingIndex >= 0) {
      newHistory = [...history];
      newHistory[existingIndex] = record;
    } else {
      newHistory = [record, ...history];
    }

    setHistory(newHistory);
    saveHistory(newHistory);
    setCurrentView('history');
    setEditingInventory(null);
  };

  const handleDeleteInventory = (id: string) => {
    const newHistory = history.filter(h => h.id !== id);
    setHistory(newHistory);
    saveHistory(newHistory);
  };

  const handleEditInventory = (record: InventoryRecord) => {
    setEditingInventory(record);
    setCurrentView('counting');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentView={currentView} setView={(v) => {
        setCurrentView(v);
        if (v !== 'counting') setEditingInventory(null);
      }} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {currentView === 'products' && (
          <ProductManager products={products} onUpdate={handleUpdateProducts} />
        )}
        
        {currentView === 'counting' && (
          <InventoryCounter 
            products={products.filter(p => p.status === 'Active')} 
            onSave={handleSaveInventory}
            history={history}
            editRecord={editingInventory}
            onCancelEdit={() => {
              setEditingInventory(null);
              setCurrentView('history');
            }}
          />
        )}
        
        {currentView === 'history' && (
          <InventoryHistory 
            history={history} 
            products={products}
            onDelete={handleDeleteInventory}
            onEdit={handleEditInventory}
          />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 text-center text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} Inventory Master Pro - Built for Efficiency
      </footer>
    </div>
  );
};

export default App;
