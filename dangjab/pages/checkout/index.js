// /pages/checkout.js
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useCart } from '@/contexts/CartContext';
import CheckoutForm from '@/components/CheckoutForm';
import CheckoutSummary from '@/components/CheckoutSummary';
import { useRouter } from 'next/router';

export default function CheckoutPage() {
  const { getCartTotals } = useCart();
  const { hasItems } = getCartTotals();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if cart is empty
  useEffect(() => {
    if (!hasItems) {
      router.push('/cart');
    }
  }, [hasItems, router]);

  const handleOrderSubmit = async (orderData) => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (response.ok) {
        // Redirect to success page
        router.push(`/checkout/success?orderId=${result.orderId}`);
      } else {
        throw new Error(result.error || 'Order creation failed');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      alert('주문 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!hasItems) {
    return <Layout><div>Loading...</div></Layout>;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">주문/결제</h1>
            <p className="text-gray-600 mt-2">주문 정보를 입력하고 결제를 완료해주세요</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form - Takes up 2/3 of space */}
            <div className="lg:col-span-2">
              <CheckoutForm 
                onSubmit={handleOrderSubmit} 
                isProcessing={isProcessing}
              />
            </div>
            
            {/* Order Summary - Takes up 1/3 of space */}
            <div className="lg:col-span-1">
              <CheckoutSummary />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}