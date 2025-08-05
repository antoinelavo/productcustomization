// @/components/Header.jsx
import React from 'react';
import { ShoppingCart, User, Heart } from 'lucide-react';

export default function Header() {

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
              <img 
                src="/images/logo.png" 
                alt="Logo" 
                className="h-16 w-auto cursor-pointer"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Wishlist Button */}
            <button className="p-2 text-gray-400 hover:text-black transition-colors cursor-pointer">
              <Heart size={20} />
            </button>
            
            {/* Cart Button */}
              <button className="p-2 text-gray-400 hover:text-black transition-colors relative cursor-pointer">
                <ShoppingCart size={20} />
              </button>
            
            {/* User Button */}
            <button 
              className="p-2 text-gray-400 hover:text-black transition-colors relative cursor-pointer"
            >
              <User size={20} />
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}