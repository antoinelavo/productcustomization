// @/components/Navigation.jsx
import React from 'react';

export default function Navigation() {
  const categories = [
    '텀블러',
    '머그잔',
    '에코백',
    '티셔츠',
    '후드티',
    '맨투맨'

  ];

  return (
    <nav className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-8 py-3 overflow-x-auto">
          {categories.map((category, index) => (
            <button
              key={index}
              className="whitespace-nowrap text-sm text-gray-700 hover:text-gray-900 font-medium transition-colors hover:bg-white px-3 py-2 rounded-md"
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}