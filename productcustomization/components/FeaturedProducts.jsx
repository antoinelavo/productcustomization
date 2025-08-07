// @/components/FeaturedProducts.jsx
import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';

export default function FeaturedProducts() {
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <a href={`/product/2DTShirt`}>
              <div
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Product Image Container */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  {/* Badge */}
                  {/* <div className="absolute top-3 left-3 z-10">
                  <span className={`${product.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full shadow-md`}>
                      {product.badge}
                  </span>
                  </div> */}

                  {/* Wishlist Button */}
                  <button className="absolute top-3 right-3 z-10 bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 p-2 rounded-full transition-all duration-50 shadow-md">
                    <Heart className="w-4 h-4" />
                  </button>

                  {/* Product Image */}
                  <div className="relative w-full h-full">
                    {/* Main Image */}
                    <img 
                      src="/images/tshirt.png"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-100"
                      onError={(e) => {
                        // Fallback placeholder
                        e.target.src = '/images/logo.png';
                      }}
                    />
                
                  </div>

                  {/* Quick Add to Cart (appears on hover) */}
                  {/* <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-100 p-4">
                  <button className="w-full bg-white text-gray-900 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      장바구니에 넣기
                  </button>
                  </div> */}
                </div>

                {/* Product Information */}
                <div className="p-4">
                  {/* Product Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight line-clamp-2">
                    2D 티셔츠
                  </h3>
                  
                  {/* Product Subtitle */}
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed line-clamp-2">
                    2D 티셔츠 제작 페이지입니다
                  </p>

                  {/* Price Section */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-900">
                        39,000원
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        49,000원
                      </span>
                    </div>
                    <div className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                      {Math.round(((49000 - 39000) / 39000) * 100)}% 할인
                    </div>
                  </div>
                </div>
              </div>
            </a>
            <a href={`/product/2DTumbler`}>
              <div
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Product Image Container */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  {/* Badge */}
                  {/* <div className="absolute top-3 left-3 z-10">
                  <span className={`${product.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full shadow-md`}>
                      {product.badge}
                  </span>
                  </div> */}

                  {/* Wishlist Button */}
                  <button className="absolute top-3 right-3 z-10 bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 p-2 rounded-full transition-all duration-50 shadow-md">
                    <Heart className="w-4 h-4" />
                  </button>

                  {/* Product Image */}
                  <div className="relative w-full h-full">
                    {/* Main Image */}
                    <img 
                      src="/images/tumbler2.png"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-100"
                      onError={(e) => {
                        // Fallback placeholder
                        e.target.src = '/images/logo.png';
                      }}
                    />
                
                  </div>

                  {/* Quick Add to Cart (appears on hover) */}
                  {/* <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-100 p-4">
                  <button className="w-full bg-white text-gray-900 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      장바구니에 넣기
                  </button>
                  </div> */}
                </div>

                {/* Product Information */}
                <div className="p-4">
                  {/* Product Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight line-clamp-2">
                    2D 텀블러
                  </h3>
                  
                  {/* Product Subtitle */}
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed line-clamp-2">
                    2D 텀블러 제작 페이지입니다
                  </p>

                  {/* Price Section */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-900">
                        29,000원
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        39,000원
                      </span>
                    </div>
                    <div className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                      {Math.round(((39000 - 29000) / 39000) * 100)}% 할인
                    </div>
                  </div>
                </div>
              </div>
            </a>
            <a href={`/product/3DTShirt`}>
              <div
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Product Image Container */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  {/* Badge */}
                  {/* <div className="absolute top-3 left-3 z-10">
                  <span className={`${product.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full shadow-md`}>
                      {product.badge}
                  </span>
                  </div> */}

                  {/* Wishlist Button */}
                  <button className="absolute top-3 right-3 z-10 bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 p-2 rounded-full transition-all duration-50 shadow-md">
                    <Heart className="w-4 h-4" />
                  </button>

                  {/* Product Image */}
                  <div className="relative w-full h-full">
                    {/* Main Image */}
                    <img 
                      src="/images/tshirt2.png"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-100"
                      onError={(e) => {
                        // Fallback placeholder
                        e.target.src = '/images/logo.png';
                      }}
                    />
                
                  </div>

                  {/* Quick Add to Cart (appears on hover) */}
                  {/* <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-100 p-4">
                  <button className="w-full bg-white text-gray-900 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      장바구니에 넣기
                  </button>
                  </div> */}
                </div>

                {/* Product Information */}
                <div className="p-4">
                  {/* Product Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight line-clamp-2">
                    3D 티셔츠
                  </h3>
                  
                  {/* Product Subtitle */}
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed line-clamp-2">
                    3D 티셔츠 제작 페이지입니다
                  </p>

                  {/* Price Section */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-900">
                        29,000원
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        39,000원
                      </span>
                    </div>
                    <div className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                      {Math.round(((39000 - 29000) / 39000) * 100)}% 할인
                    </div>
                  </div>
                </div>
              </div>
            </a>
        </div>
      </div>
    </section>
  );
}