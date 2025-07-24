// @/components/Header.jsx
import React from 'react';
import { ShoppingCart, User, Heart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';

export default function Header() {
  const { getCartTotals } = useCart();
  const { itemCount } = getCartTotals();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <img 
                src="/images/logo.png" 
                alt="Logo" 
                className="h-16 w-auto cursor-pointer"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
            </Link>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Wishlist Button */}
            <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <Heart size={20} />
            </button>
            
            {/* Cart Button */}
            <Link href="/cart">
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors relative cursor-pointer">
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </button>
            </Link>
            
            {/* User Button */}
            <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <User size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}