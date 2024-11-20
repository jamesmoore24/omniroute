import React from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from 'lucide-react';
import logo from '../cticon.png';

export default function Footer() {
  return (
    <footer className="bg-gray-50">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Navigation className="h-6 w-6 text-indigo-600" />
              <span className="text-xl font-bold">OmniRoute.ai</span>
            </div>
            <p className="text-gray-600 max-w-md">
              Innovating education and market research with AI-powered solutions that drive results and insights.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Test Products</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/edtech" className="text-gray-600 hover:text-indigo-600">
                  EdTech Platform
                </Link>
              </li>
              <li>
                <Link to="/market-research" className="text-gray-600 hover:text-indigo-600">
                  Market Research AI
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Connect to Casey or James</h3>
            <div className="flex space-x-4">
              <a href="https://caseytewey.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-indigo-600">
                <img src={logo} alt="Website Logo" className="h-5 w-5" />
              </a>
              <a href="https://jamesmoore24.github.io/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-5 w-5 rounded-full bg-indigo-600 hover:bg-indigo-700 transition-colors">
                {/* Circle icon */}
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
          <p>{new Date().getFullYear()} OmniRoute.ai - Product Concept Test - Not for public use or sale.</p>
        </div>
      </div>
    </footer>
  );
}