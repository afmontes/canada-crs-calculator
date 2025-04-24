import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import CRSCalculator from './components/CRSCalculator';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Canada Express Entry</h1>
          <h2 className="text-2xl font-semibold text-blue-700">CRS Score Calculator</h2>
          <p className="text-gray-600 mt-2">Updated for 2025 Immigration Criteria</p>
        </header>
        
        <CRSCalculator />
        
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>This calculator is based on the official Comprehensive Ranking System criteria as of April 2025.</p>
          <p className="mt-1">For official information, please visit the <a href="https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/check-score.html" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">IRCC website</a>.</p>
        </footer>
      </div>
    </div>
  </React.StrictMode>
);