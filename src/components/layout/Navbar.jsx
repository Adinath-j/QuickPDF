import React from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl tracking-tight text-slate-900">
              QuickPDF
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex gap-6">
            <Link to="/merge" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
              Merge PDF
            </Link>
            <Link to="/split" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
              Split PDF
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}