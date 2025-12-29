
import React from 'react';
import { View } from '../types';
import { Shield, BookOpen, UserPlus, Scan, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: View;
  onViewChange: (view: View) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: View.DASHBOARD, label: 'Accueil', icon: Shield },
    { id: View.THEORY, label: 'État de l\'Art', icon: BookOpen },
    { id: View.REGISTRATION, label: 'Configuration', icon: UserPlus },
    { id: View.DETECTION, label: 'Démo Live', icon: Scan },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-indigo-900 text-white p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-2 mb-10">
          <Shield className="w-8 h-8 text-indigo-300" />
          <h1 className="text-xl font-bold tracking-tight">SecureFace</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeView === item.id 
                  ? 'bg-indigo-700 text-white shadow-lg' 
                  : 'text-indigo-200 hover:bg-indigo-800'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-indigo-800 text-xs text-indigo-300">
          M2 Imagine - Traitement d'Image
        </div>
      </aside>

      {/* Mobile Nav */}
      <div className="md:hidden bg-indigo-900 text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-indigo-300" />
          <span className="font-bold">SecureFace</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-indigo-900 z-40 pt-20 px-6 space-y-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onViewChange(item.id);
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-4 p-4 text-xl text-indigo-100"
            >
              <item.icon className="w-6 h-6" />
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-10">
        {children}
      </main>
    </div>
  );
};

export default Layout;
