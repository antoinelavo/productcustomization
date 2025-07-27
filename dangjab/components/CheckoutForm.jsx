// /components/CheckoutForm.jsx
import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { User, MapPin, Phone, Mail, CreditCard } from 'lucide-react';
import PortOne from "@portone/browser-sdk/v2";

export default function CheckoutForm({ onSubmit, isProcessing }) {
  const { cartItems, getCartTotals } = useCart();
  const { total } = getCartTotals();
  
  const [formData, setFormData] = useState({
    // Customer Info
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    
    // Shipping Address
    shippingAddress: '',
    shippingAddressDetail: '',
    shippingCity: '',
    shippingPostalCode: '',
    
    // Order Notes
    orderNotes: '',
    
    // Payment Method (for now just placeholder)
    paymentMethod: 'card'
  });

  const [errors, setErrors] = useState({});
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  // Generate random payment ID (from official docs)
  function randomId() {
    return [...crypto.getRandomValues(new Uint32Array(2))]
      .map((word) => word.toString(16).padStart(8, "0"))
      .join("")
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.customerName.trim()) newErrors.customerName = '이름을 입력해주세요';
    if (!formData.customerEmail.trim()) newErrors.customerEmail = '이메일을 입력해주세요';
    if (!formData.customerPhone.trim()) newErrors.customerPhone = '전화번호를 입력해주세요';
    if (!formData.shippingAddress.trim()) newErrors.shippingAddress = '주소를 입력해주세요';
    if (!formData.shippingCity.trim()) newErrors.shippingCity = '도시를 입력해주세요';
    if (!formData.shippingPostalCode.trim()) newErrors.shippingPostalCode = '우편번호를 입력해주세요';

    // Email validation
    if (formData.customerEmail && !/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = '올바른 이메일 형식을 입력해주세요';
    }

    // Phone validation (basic)
    if (formData.customerPhone && formData.customerPhone.length < 10) {
      newErrors.customerPhone = '올바른 전화번호를 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (paymentProcessing || isProcessing) {
      return;
    }

    setPaymentProcessing(true);

    try {
      // Generate unique payment ID (using PortOne's recommended method)
      const paymentId = randomId();

      console.log('Requesting payment with ID:', paymentId);

      // Request payment using correct PortOne API
      const payment = await PortOne.requestPayment({
        storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID,
        channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY,
        paymentId: paymentId,
        orderName: `주문 #${paymentId.slice(-8)}`,
        totalAmount: total,
        currency: "KRW",
        payMethod: "CARD",
        
        // Customer info
        customer: {
          fullName: formData.customerName,
          phoneNumber: formData.customerPhone,
          email: formData.customerEmail,
        },
        
        // Additional customer address (optional)
        address: {
          country: "KR",
          addressLine1: formData.shippingAddress,
          addressLine2: formData.shippingAddressDetail,
          city: formData.shippingCity,
          zipcode: formData.shippingPostalCode,
        },

        // Custom data to verify on server
        // customData: {
        //   orderNotes: formData.orderNotes,
        //   cartItems: cartItems.map(item => ({
        //     productId: item.productId,
        //     name: item.name,
        //     quantity: item.quantity,
        //     price: item.currentPrice,
        //     customization: item.customization
        //   }))
        // },

        // Redirect URL for mobile
        redirectUrl: `${window.location.origin}/checkout/success`,
      });

      // Check if payment failed
      if (payment.code !== undefined) {
        console.error('Payment failed:', payment);
        alert(`결제 실패: ${payment.message}`);
        return;
      }

      console.log('Payment successful:', payment);

      // Payment succeeded - now verify on server
      const verificationResponse = await fetch('/api/orders/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId: payment.paymentId,
          customerData: formData,
          cartItems: cartItems
        }),
      });

      const verificationResult = await verificationResponse.json();

      if (verificationResponse.ok) {
        // Payment verified successfully
        onSubmit({
          ...formData,
          cartItems,
          paymentId: payment.paymentId,
          paymentData: payment,
          groupOrderId: verificationResult.groupOrderId,
          success: true
        });
      } else {
        throw new Error(verificationResult.error || 'Payment verification failed');
      }

    } catch (error) {
      console.error('Payment error:', error);
      alert('결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  const isButtonDisabled = paymentProcessing || isProcessing;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      
      {/* Customer Information */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center mb-6">
          <User className="w-5 h-5 text-gray-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-900">주문자 정보</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이름 *
            </label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              disabled={isButtonDisabled}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
                errors.customerName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="홍길동"
            />
            {errors.customerName && (
              <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              전화번호 *
            </label>
            <input
              type="tel"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleInputChange}
              disabled={isButtonDisabled}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
                errors.customerPhone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="010-1234-5678"
            />
            {errors.customerPhone && (
              <p className="text-red-500 text-sm mt-1">{errors.customerPhone}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이메일 *
            </label>
            <input
              type="email"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleInputChange}
              disabled={isButtonDisabled}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
                errors.customerEmail ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="hong@example.com"
            />
            {errors.customerEmail && (
              <p className="text-red-500 text-sm mt-1">{errors.customerEmail}</p>
            )}
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center mb-6">
          <MapPin className="w-5 h-5 text-gray-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-900">배송 주소</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              주소 *
            </label>
            <input
              type="text"
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={handleInputChange}
              disabled={isButtonDisabled}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
                errors.shippingAddress ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="서울특별시 강남구 테헤란로 123"
            />
            {errors.shippingAddress && (
              <p className="text-red-500 text-sm mt-1">{errors.shippingAddress}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              상세 주소
            </label>
            <input
              type="text"
              name="shippingAddressDetail"
              value={formData.shippingAddressDetail}
              onChange={handleInputChange}
              disabled={isButtonDisabled}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="아파트, 동/호수 등"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                도시 *
              </label>
              <input
                type="text"
                name="shippingCity"
                value={formData.shippingCity}
                onChange={handleInputChange}
                disabled={isButtonDisabled}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.shippingCity ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="서울"
              />
              {errors.shippingCity && (
                <p className="text-red-500 text-sm mt-1">{errors.shippingCity}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                우편번호 *
              </label>
              <input
                type="text"
                name="shippingPostalCode"
                value={formData.shippingPostalCode}
                onChange={handleInputChange}
                disabled={isButtonDisabled}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.shippingPostalCode ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="12345"
              />
              {errors.shippingPostalCode && (
                <p className="text-red-500 text-sm mt-1">{errors.shippingPostalCode}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order Notes */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">주문 메모</h2>
        <textarea
          name="orderNotes"
          value={formData.orderNotes}
          onChange={handleInputChange}
          disabled={isButtonDisabled}
          rows="4"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder="배송 관련 요청사항이나 기타 메모를 입력해주세요 (선택사항)"
        />
      </div>

      {/* Submit Button */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <button
          type="submit"
          disabled={isButtonDisabled}
          className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-colors duration-200 flex items-center justify-center space-x-2 ${
            isButtonDisabled
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          <CreditCard size={20} />
          <span>
            {paymentProcessing ? '결제 진행 중...' : 
             isProcessing ? '주문 처리 중...' : 
             `${formatPrice(total)}원 결제하기`}
          </span>
        </button>
        
        <p className="text-sm text-gray-500 text-center mt-4">
          테스트 결제입니다. 실제 금액이 청구되지 않습니다.
        </p>
      </div>
    </form>
  );
}