// @/components/2DShirt/DefaultPanel.jsx
'use client'

import React from 'react'
import { Minus, Plus } from 'lucide-react'

const SIZES = [
  { value: 'S', label: 'S', available: true },
  { value: 'M', label: 'M', available: true },
  { value: 'L', label: 'L', available: true },
  { value: 'XL', label: 'XL', available: true },
  { value: '2XL', label: '2XL', available: true },
  { value: '3XL', label: '3XL', available: true }
]

export default function DefaultPanel({
  selectedSize,
  setSelectedSize,
  quantity,
  setQuantity,
  onAddToCart
}) {

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1)
  }

  const decreaseQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1))
  }

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 1
    setQuantity(Math.max(1, value))
  }

  // Calculate price (example pricing)
  const basePrice = 39000
  const selectedSizeData = SIZES.find(size => size.value === selectedSize)
  const sizeExtraCost = selectedSizeData?.extraCost || 0
  const totalPrice = (basePrice + sizeExtraCost) * quantity

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">상품 옵션</h2>
        <p className="text-sm text-gray-600 mt-1">크기와 수량을 선택하세요</p>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        
        {/* Size Selection */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">
              사이즈
            </label>
            <span className="text-xs text-gray-400">
              ⓘ
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {SIZES.map((size) => (
              <button
                key={size.value}
                onClick={() => setSelectedSize(size.value)}
                disabled={!size.available}
                className={`
                  relative p-3 border rounded-lg text-sm font-medium transition-all
                  ${selectedSize === size.value 
                    ? 'border-orange-500 bg-orange-50 text-orange-700' 
                    : size.available 
                      ? 'border-gray-300 hover:border-gray-400 text-gray-700'
                      : 'border-gray-200 text-gray-400 cursor-not-allowed'
                  }
                  ${size.recommended ? 'ring-1 ring-orange-200' : ''}
                `}
              >
                {size.label}
                {/* {size.extraCost && (
                  <div className="text-xs text-gray-500 mt-1">
                    +{size.extraCost.toLocaleString()}원
                  </div>
                )} */}
              </button>
            ))}
          </div>
        
        </div>

        {/* Quantity Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            수량
          </label>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
              className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus size={16} />
            </button>
            
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
            />
            
            <button
              onClick={increaseQuantity}
              className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            1개부터 주문 가능
          </p>
        </div>

        {/* Price Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>기본가격</span>
              <span>{basePrice.toLocaleString()}원</span>
            </div>
            
            {sizeExtraCost > 0 && (
              <div className="flex justify-between text-sm">
                <span>사이즈 추가금 ({selectedSize})</span>
                <span>+{sizeExtraCost.toLocaleString()}원</span>
              </div>
            )}
            
            <div className="flex justify-between text-sm">
              <span>수량</span>
              <span>{quantity}개</span>
            </div>
            
            <div className="border-t border-gray-200 pt-2">
              <div className="flex justify-between font-semibold">
                <span>배송비</span>
                <span>3,000원</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="text-sm text-gray-600">
          <p className="font-medium mb-2">배송 정보</p>
          <ul className="space-y-1 text-xs">
            <li>• 평일 오후 2시 이전 주문시 당일 발송</li>
            <li>• 주말 및 공휴일 제외</li>
            <li>• 제주도/도서산간 지역 추가 배송비</li>
          </ul>
        </div>
      </div>

      {/* Footer - Total Price and Add to Cart */}
      <div className="border-t border-gray-200 p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">총 {quantity}개</p>
            <p className="text-2xl font-bold text-gray-900">
              {(totalPrice + 3000).toLocaleString()}원
            </p>
          </div>
        </div>
        
        <button
          onClick={onAddToCart}
          className="w-full bg-black text-white py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors"
        >
          장바구니 담기
        </button>
        
        <div className="grid grid-cols-2 gap-3">
          <button className="border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            찜하기
          </button>
          <button className="bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            바로주문
          </button>
        </div>
      </div>
    </div>
  )
}