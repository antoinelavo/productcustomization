// /components/CartItems.jsx
import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { Minus, Plus, Trash2, Package } from 'lucide-react';
import Link from 'next/link';

export default function CartItems() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const handleQuantityChange = (cartItemId, newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 99) {
      updateQuantity(cartItemId, newQuantity);
    }
  };

  const handleRemove = (cartItemId, itemName) => {
    if (confirm(`${itemName}을(를) 장바구니에서 제거하시겠습니까?`)) {
      removeFromCart(cartItemId);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">
          장바구니 상품 ({cartItems.length}개)
        </h2>
      </div>

      <div className="divide-y divide-gray-200">
        {cartItems.map((item) => (
          <div key={item.cartItemId} className="p-6">
            <div className="flex items-start space-x-4">
              
              {/* Product Image */}
              <div className="flex-shrink-0">
                <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                onError={(e) => {
                    e.target.style.display = 'none';
                }}
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      <Link 
                        href={`/product/${item.slug}`}
                        className="hover:text-blue-600 transition-colors duration-200"
                      >
                        {item.name}
                      </Link>
                    </h3>
                    
                    {/* Customization Info */}
                    {item.customization && (
                      <div className="text-sm text-gray-500 mb-2">
                        {item.customization.uploadedImage && (
                          <span className="inline-flex items-center mr-3">
                            <Package className="w-4 h-4 mr-1" />
                            커스텀 이미지
                          </span>
                        )}
                        {(item.customization.textSettings?.topText || 
                          item.customization.textSettings?.bottomText) && (
                          <span className="inline-flex items-center">
                            <Package className="w-4 h-4 mr-1" />
                            커스텀 텍스트
                          </span>
                        )}
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(item.currentPrice)}원
                      </span>
                      {item.originalPrice > item.currentPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(item.originalPrice)}원
                        </span>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item.cartItemId, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        
                        <input
                          type="number"
                          min="1"
                          max="99"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.cartItemId, parseInt(e.target.value))}
                          className="w-12 h-8 text-center border-0 focus:ring-0 text-sm"
                        />
                        
                        <button
                          onClick={() => handleQuantityChange(item.cartItemId, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-50"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <span className="text-sm text-gray-600">개</span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(item.cartItemId, item.name)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                    title="상품 제거"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Item Total */}
                <div className="mt-3 text-right">
                  <span className="text-lg font-bold text-blue-600">
                    {formatPrice(item.currentPrice * item.quantity)}원
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}