// /components/CartSummary.jsx
import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { ShoppingBag, Truck } from 'lucide-react';
import { useRouter } from 'next/router';


export default function CartSummary() {
  const { getCartTotals } = useCart();
  const { itemCount, subtotal, shipping, total } = getCartTotals();
  const router = useRouter();


  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-8">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">주문 요약</h2>
      </div>

      {/* Summary Content */}
      <div className="p-6 space-y-4">
        
        {/* Item Count */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">상품 수량</span>
          <span className="font-medium">{itemCount}개</span>
        </div>

        {/* Subtotal */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">상품 금액</span>
          <span className="font-medium">{formatPrice(subtotal)}원</span>
        </div>

        {/* Shipping */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <Truck className="w-4 h-4 mr-1 text-gray-400" />
            <span className="text-gray-600">배송비</span>
          </div>
          <span className="font-medium">
            {shipping === 0 ? (
              <span className="text-green-600">무료</span>
            ) : (
              <span>{formatPrice(shipping)}원</span>
            )}
          </span>
        </div>

        {/* Free Shipping Notice */}
        {shipping > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-700">
              {formatPrice(50000 - subtotal)}원 더 구매하시면 배송비 0원!
            </p>
          </div>
        )}

        {/* Divider */}
        <hr className="border-gray-200" />

        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">총 결제금액</span>
          <span className="text-2xl font-bold text-blue-600">
            {formatPrice(total)}원
          </span>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2 mt-6"
        >
          <ShoppingBag size={20} />
          <span>주문하기</span>
        </button>

        {/* Continue Shopping Link */}
        <a
          href="/"
          className="block w-full text-center py-3 px-6 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors duration-200">
          쇼핑 계속하기
        </a>

        {/* Additional Information */}
        <div className="text-xs text-gray-500 mt-4 space-y-1">
          <p>• 결제 후 3-5일 내 제작 및 발송</p>
          <p>• 5만원 이상 구매시 무료배송</p>
          <p>• 커스터마이징 상품은 교환/환불 제한</p>
        </div>
      </div>
    </div>
  );
}