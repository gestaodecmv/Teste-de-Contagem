
import React from 'react';
import { View } from '../types';

interface NavbarProps {
  currentView: View;
  setView: (view: View) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  const navItems: { label: string; value: View }[] = [
    { label: 'Register Products', value: 'products' },
    { label: 'Inventory Count', value: 'counting' },
    { label: 'History & Audit', value: 'history' },
  ];

  return (
    <nav className="bg-indigo-700 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="bg-white p-1.5 rounded-lg">
              <svg className="w-6 h-6 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tight">InvMaster</span>
          </div>
          
          <div className="flex gap-1">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => setView(item.value)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === item.value 
                    ? 'bg-indigo-800 text-white' 
                    : 'text-indigo-100 hover:bg-indigo-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
