// /pages/cart.js
import React from 'react';
import Layout from '@/components/Layout';
import { useCart } from '@/contexts/CartContext';
import CartItems from '@/components/CartItems';
import CartSummary from '@/components/CartSummary';
import Link from 'next/link';

export default function CartPage() {
  const { getCartTotals } = useCart();
  const { hasItems } = getCartTotals();

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {hasItems ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items - Takes up 2/3 of space */}
              <div className="lg:col-span-2">
                <CartItems />
              </div>
              
              {/* Cart Summary - Takes up 1/3 of space */}
              <div className="lg:col-span-1">
                <CartSummary />
              </div>
            </div>
          ) : (
            <EmptyCart />
          )}
        </div>
      </div>
    </Layout>
  );
}

// Empty cart component
function EmptyCart() {
  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
          <span className="text-4xl">🛒</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">장바구니가 비어있습니다</h2>
        <p className="text-gray-600 mb-8">원하는 상품을 장바구니에 담아보세요!</p>
        <Link 
          href="/"
          className="inline-block bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-xl transition-colors duration-200"
        >
          쇼핑 계속하기
        </Link>
      </div>
    </div>
  )
}