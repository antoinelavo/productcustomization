// /pages/checkout.js
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useCart } from '@/contexts/CartContext';
import CheckoutForm from '@/components/CheckoutForm';
import CheckoutSummary from '@/components/CheckoutSummary';
import { useRouter } from 'next/router';

export default function CheckoutPage() {
  const { getCartTotals, clearCart } = useCart();
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
      // The payment has already been verified and order created in CheckoutForm
      // We just need to clear the cart and redirect to success page
      
      console.log('✅ Order completed successfully:', orderData.groupOrderId || orderData.orderId);
      
      // Clear the cart since order is complete
      clearCart();
      
      // Redirect to success page with the order ID
      const orderId = orderData.groupOrderId || orderData.orderId;
      router.push(`/checkout/success?orderId=${orderId}`);
      
    } catch (error) {
      console.error('Order completion error:', error);
      alert('주문 완료 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
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