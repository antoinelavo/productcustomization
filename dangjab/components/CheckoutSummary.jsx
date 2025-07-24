// /components/CheckoutSummary.jsx
import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { Package, Truck, CreditCard } from 'lucide-react';

export default function CheckoutSummary() {
  const { cartItems, getCartTotals } = useCart();
  const { itemCount, subtotal, shipping, total } = getCartTotals();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-8">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">주문 요약</h2>
      </div>

      {/* Order Items */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
          <Package className="w-4 h-4 mr-2" />
          주문 상품 ({itemCount}개)
        </h3>
        
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {cartItems.map((item) => (
            <div key={item.cartItemId} className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAxNkgyOFYyMEgyMFYxNloiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTI4IDIwSDMyVjI4SDI4VjIwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMjggMjhIMjBWMzJIMjhWMjhaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0yMCAyOEgxNlYyMEgyMFYyOFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                  }}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.name}
                </p>
                <p className="text-sm text-gray-500">
                  {item.quantity}개 × {formatPrice(item.currentPrice)}원
                </p>
              </div>
              
              <div className="text-sm font-medium text-gray-900">
                {formatPrice(item.currentPrice * item.quantity)}원
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Totals */}
      <div className="p-6 space-y-4">
        
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
              {formatPrice(50000 - subtotal)}원 더 구매하시면 무료배송!
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

        {/* Payment Method Info */}
        <div className="bg-gray-50 rounded-lg p-4 mt-6">
          <div className="flex items-center mb-2">
            <CreditCard className="w-4 h-4 mr-2 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">결제 방법</span>
          </div>
          <p className="text-sm text-gray-600">
            현재는 무통장 입금만 지원합니다.
            <br />
            주문 완료 후 계좌 정보를 안내해드립니다.
          </p>
        </div>

        {/* Additional Info */}
        <div className="text-xs text-gray-500 mt-4 space-y-1">
          <p>• 주문 완료 후 3-5일 내 제작 및 발송</p>
          <p>• 커스터마이징 상품은 교환/환불 제한</p>
          <p>• 입금 확인 후 제작이 시작됩니다</p>
        </div>
      </div>
    </div>
  );
}