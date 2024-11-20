import React from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Navigation className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              OmniRoute
            </span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/edtech" className="text-gray-600 hover:text-indigo-600 transition-colors">
              EdTech
            </Link>
            <Link to="/market-research" className="text-gray-600 hover:text-indigo-600 transition-colors">
              Market Research
            </Link>
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}