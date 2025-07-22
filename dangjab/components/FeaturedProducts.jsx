// @/components/FeaturedProducts.jsx
import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';

export default function FeaturedProducts() {
  const products = [
    {
      title: '티셔츠',
      subtitle: '1400개의 고객 후기가 증명하는 제작 퀄리티',
      image: '/images/FeaturedProducts/tshirt.png',
      hoverImage: '/images/FeaturedProducts/tshirt-hover.png',
      originalPrice: '49900',
      salePrice: '39900',
      badge: '베스트셀러',
      badgeColor: 'bg-red-500',
      slug: 'tshirt'
    },
    {
      title: '텀블러',
      subtitle: '보온보냉 + 대용량 + 손잡이 각인까지!',
      image: '/images/FeaturedProducts/tumbler.png',
      hoverImage: '/images/FeaturedProducts/tumbler-hover.png',
      originalPrice: '49900',
      salePrice: '39900',
      badge: '신상품',
      badgeColor: 'bg-blue-500',
      slug: 'tshirt'
    },
    {
      title: '머그잔',
      subtitle: '신혼부부, 집들이 선물로 딱!',
      image: '/images/FeaturedProducts/mug.png',
      hoverImage: '/images/FeaturedProducts/mug-hover.png',
      originalPrice: '35000',
      salePrice: '13900',
      badge: '인기',
      badgeColor: 'bg-pink-500',
      slug: 'tshirt'
    },
    {
      title: '에코백',
      subtitle: '강아지 산책 가방으로 최고!',
      image: '/images/FeaturedProducts/tote.png',
      hoverImage: '/images/FeaturedProducts/tote-hover.png',
      originalPrice: '29500',
      salePrice: '19500',
      badge: '빠른제작',
      badgeColor: 'bg-green-500',
      slug: 'tshirt'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            귀여운 우리 아이 얼굴이 쏙!
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <a href={`/product/${product.slug}`}>
                <div
                key={index}
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
                        src={product.image}
                        alt={product.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-100 group-hover:opacity-0"
                        onError={(e) => {
                        // Fallback placeholder
                        e.target.src = '/api/placeholder/400/400';
                        }}
                    />
                    
                    {/* Hover Image */}
                    <img 
                        src={product.hoverImage}
                        alt={`${product.title} - 호버 이미지`}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-100"
                        onError={(e) => {
                        // Fallback to main image if hover image fails
                        e.target.src = product.image;
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
                    {product.title}
                    </h3>
                    
                    {/* Product Subtitle */}
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed line-clamp-2">
                    {product.subtitle}
                    </p>

                    {/* Price Section */}
                    <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">
                        {Number(product.salePrice).toLocaleString('ko-KR')}원
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                        {Number(product.originalPrice).toLocaleString('ko-KR')}원
                        </span>
                    </div>
                    <div className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                        {Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100)}% 할인
                    </div>
                    </div>
                </div>
                </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}