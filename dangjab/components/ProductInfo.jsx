// /components/ProductInfo.jsx
import React, { useState } from 'react';
import { ShoppingCart, Package, Star, Image } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export default function ProductInfo({ product, customizationData = null }) {
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [customQuantity, setCustomQuantity] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const cartStuff = useCart();
  const { addToCart } = cartStuff;

  // Format price to Korean Won
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  // Calculate discount percentage based on quantity
  const getDiscountPercentage = (quantity) => {
    if (quantity === 1) return 0;
    if (quantity <= 10) return (quantity - 1) * 1.25;
    return 11.25; // Fixed discount for 10+ units
  };

  // Calculate discounted price per unit
  const getDiscountedPricePerUnit = (quantity) => {
    const discountPercentage = getDiscountPercentage(quantity);
    return product.current_price * (1 - discountPercentage / 100);
  };

  // Calculate total price for a given quantity
  const getTotalPrice = (quantity) => {
    return getDiscountedPricePerUnit(quantity) * quantity;
  };

  // Get current quantity (either selected or custom)
  const getCurrentQuantity = () => {
    if (showCustomInput && customQuantity) {
      return parseInt(customQuantity) || 10;
    }
    return selectedQuantity;
  };

  // Handle quantity selection
  const handleQuantitySelect = (quantity) => {
    if (quantity === '10+') {
      setShowCustomInput(true);
      setSelectedQuantity(10);
    } else {
      setShowCustomInput(false);
      setSelectedQuantity(quantity);
      setCustomQuantity('');
    }
  };

  // Handle custom quantity input
  const handleCustomQuantityChange = (e) => {
    const value = e.target.value;
    if (value === '' || (parseInt(value) >= 10 && parseInt(value) <= 999)) {
      setCustomQuantity(value);
    }
  };

  // Check if user has added customizations
  const hasCustomizations = customizationData && (
    customizationData.uploadedImage || 
    customizationData.textSettings?.topText ||
    customizationData.textSettings?.bottomText ||
    customizationData.textSettings?.leftText ||
    customizationData.textSettings?.rightText ||
    customizationData.selectedColor !== '#ffffff'
  );

  const handleAddToCart = () => {
    const quantity = getCurrentQuantity();
    console.log('🛒 Adding to cart:', product.name, 'Quantity:', quantity);
    console.log('🎨 Customization data:', customizationData);
    
    // Use the passed customization data or fall back to defaults
    const customization = customizationData || {
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

    console.log('📦 Final customization being added to cart:', customization);

    // Actually add to cart using our cart context!
    addToCart(product, quantity, customization);
    
    // Show success message with customization info
    let successMessage = `${product.name} ${quantity}개가 장바구니에 추가되었습니다!`;
    if (hasCustomizations) {
      successMessage += '\n커스터마이징 옵션이 포함되었습니다.';
    }
    
    alert(successMessage);
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

            {/* Customization Preview */}
            {hasCustomizations && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                  <Image className="w-4 h-4 mr-2" />
                  선택된 커스터마이징
                </h3>
                
                <div className="space-y-2 text-sm">
                  {customizationData?.uploadedImage && (
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-700">✓ 업로드된 이미지:</span>
                      <span className="text-blue-600 font-medium">
                        {customizationData.uploadedImage.includes('supabase') ? '사용자 업로드 이미지' : '선택된 이미지'}
                      </span>
                    </div>
                  )}
                  
                  {customizationData?.textSettings?.topText && (
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-700">✓ 상단 텍스트:</span>
                      <span className="text-blue-600 font-medium">"{customizationData.textSettings.topText}"</span>
                    </div>
                  )}
                  
                  {customizationData?.textSettings?.bottomText && (
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-700">✓ 하단 텍스트:</span>
                      <span className="text-blue-600 font-medium">"{customizationData.textSettings.bottomText}"</span>
                    </div>
                  )}
                  
                  {customizationData?.textSettings?.leftText && (
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-700">✓ 좌측 텍스트:</span>
                      <span className="text-blue-600 font-medium">"{customizationData.textSettings.leftText}"</span>
                    </div>
                  )}
                  
                  {customizationData?.textSettings?.rightText && (
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-700">✓ 우측 텍스트:</span>
                      <span className="text-blue-600 font-medium">"{customizationData.textSettings.rightText}"</span>
                    </div>
                  )}
                  
                  {customizationData?.selectedColor && customizationData.selectedColor !== '#ffffff' && (
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-700">✓ 선택된 색상:</span>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded border border-gray-300"
                          style={{ backgroundColor: customizationData.selectedColor }}
                        ></div>
                        <span className="text-blue-600 font-medium">{customizationData.selectedColor}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

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
            
            {/* Bulk Pricing Options */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="space-y-4">
                
                {/* Pricing Header */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">수량별 가격</h3>
                  <p className="text-sm text-gray-600">수량이 많을수록 개당 가격이 저렴해집니다!</p>
                </div>

                {/* Quantity-Price List */}
                <div className="space-y-2">
                  {/* Quantities 1-10 */}
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((qty) => {
                    const isSelected = !showCustomInput && selectedQuantity === qty;
                    const discountPercent = getDiscountPercentage(qty);
                    const pricePerUnit = getDiscountedPricePerUnit(qty);
                    const totalPrice = getTotalPrice(qty);
                    
                    return (
                      <button
                        key={qty}
                        onClick={() => handleQuantitySelect(qty)}
                        className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50 shadow-md' 
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="font-semibold text-gray-900">
                              {qty}개
                            </span>
                            {discountPercent > 0 && (
                              <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                                {discountPercent.toFixed(1)}% 할인
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">
                              {formatPrice(Math.round(totalPrice))}원
                            </div>
                            <div className="text-sm text-gray-600">
                              개당 {formatPrice(Math.round(pricePerUnit))}원
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}

                  {/* 10+ Option */}
                  <button
                    onClick={() => handleQuantitySelect('10+')}
                    className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                      showCustomInput 
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="font-semibold text-gray-900">
                          10+ 개
                        </span>
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                          11.3% 할인
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">
                          최대 할인가
                        </div>
                        <div className="text-sm text-gray-600">
                          개당 {formatPrice(Math.round(getDiscountedPricePerUnit(10)))}원
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Custom Quantity Input */}
                  {showCustomInput && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        정확한 수량을 입력해주세요 (10개 이상)
                      </label>
                      <input
                        type="number"
                        min="10"
                        max="999"
                        value={customQuantity}
                        onChange={handleCustomQuantityChange}
                        placeholder="10"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>

                {/* Total Price Display */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-900">
                      총 결제금액
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatPrice(Math.round(getTotalPrice(getCurrentQuantity())))}원
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 text-right mt-1">
                    {getCurrentQuantity()}개 × {formatPrice(Math.round(getDiscountedPricePerUnit(getCurrentQuantity())))}원
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className={`w-full font-bold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2 ${
                    hasCustomizations 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                >
                  <ShoppingCart size={20} />
                  <span>
                    장바구니에 담기 ({getCurrentQuantity()}개)
                    {hasCustomizations && ' ✨'}
                  </span>
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