// /components/ProductInfo.jsx
import React, { useState } from 'react';
import { ShoppingCart, Minus, Plus, Package, Star } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';


export default function ProductInfo({ product }) {
  const [quantity, setQuantity] = useState(1);
  const cartStuff = useCart();
  const { addToCart } = cartStuff;

  // Format price to Korean Won
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  // Calculate total price
  const totalPrice = product.current_price * quantity;

  // Handle quantity changes
  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };

  const handleQuantityInput = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1) {
      setQuantity(value);
    }
  };

    const handleAddToCart = () => {
        console.log('🛒 Adding to cart:', product.name, 'Quantity:', quantity);
    // For now, we'll add basic customization data
    // Later we'll connect this with the ProductCustomizer
    const customization = {
        uploadedImage: null,
        textSettings: {
        topText: '',
        bottomText: '',
        leftText: '',
        rightText: '',
        textColor: '#8B4513',
        fontSize: 'medium'
        },
        selectedColor: '#ffffff'
    };

    // Actually add to cart using our cart context!
    addToCart(product, quantity, customization);
    
    // Show success message
    alert(`${product.name} ${quantity}개가 장바구니에 추가되었습니다!`);
    };

  return (
    <section className="py-8 bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column - Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}

                {/* Product Type Badge */}
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ml-[2em] ${
                  product.category === 'bundle' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {product.category === 'bundle' ? <Package className="w-4 h-4 mr-1" /> : <Star className="w-4 h-4 mr-1" />}
                  {product.category === 'bundle' ? '세트' : '단품'}
                </span>
              </h1>
              
              

              {/* Description */}
              <p className="text-lg text-gray-700">
                {product.description}
              </p>
            </div>

            {/* Bundle Contents */}
            {product.category === 'bundle' && product.bundle_contents.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">포함 상품:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.bundle_contents.map((item, index) => (
                    <span 
                      key={index}
                      className="bg-white px-3 py-1 rounded-full text-sm text-gray-700 border border-gray-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Features/Benefits */}
            <div className="space-y-3">
              <div className="flex items-center text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                <span className="text-sm">무료 배송 (5만원 이상 주문시)</span>
              </div>
              <div className="flex items-center text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                <span className="text-sm">커스터마이징 가능</span>
              </div>
              <div className="flex items-center text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                <span className="text-sm">3-5일 내 제작 완료</span>
              </div>
            </div>
          </div>

          {/* Right Column - Purchase Options */}
          <div className="space-y-6">
            
            {/* Pricing */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="space-y-4">
                
                {/* Price Display */}
                <div>
                  <div className="flex items-baseline space-x-3">
                    <span className="text-3xl font-bold text-gray-900">
                      {formatPrice(product.current_price)}원
                    </span>
                    
                    {product.has_discount && (
                      <>
                        <span className="text-lg text-gray-500 line-through">
                          {formatPrice(product.original_price)}원
                        </span>
                        <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded-full">
                          {product.discount_percentage}% 할인
                        </span>
                      </>
                    )}
                  </div>
                  
                  {product.has_discount && (
                    <p className="text-sm text-green-600 mt-1">
                      {formatPrice(product.savings)}원 절약!
                    </p>
                  )}
                </div>

                {/* Quantity Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    수량
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={decreaseQuantity}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                      disabled={quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={quantity}
                      onChange={handleQuantityInput}
                      className="w-16 h-10 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    
                    <button
                      onClick={increaseQuantity}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      <Plus size={16} />
                    </button>
                    
                    <span className="text-sm text-gray-600 ml-2">
                      개
                    </span>
                  </div>
                </div>

                {/* Total Price */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-900">
                      총 결제금액
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatPrice(totalPrice)}원
                    </span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <ShoppingCart size={20} />
                  <span>장바구니에 담기</span>
                </button>

                {/* Quick Buy Button */}
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-colors duration-200">
                  바로 구매하기
                </button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="text-sm text-gray-500 space-y-2">
              <p>• 결제 후 3-5일 내 제작 및 발송</p>
              <p>• 커스터마이징 상품은 교환/환불이 제한될 수 있습니다</p>
              <p>• 문의사항은 고객센터로 연락해 주세요</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}