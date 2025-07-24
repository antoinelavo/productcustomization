// @/components/SetPromotion.jsx
import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';

export default function SetPromotion() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch bundle products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/products/bundles');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch bundle products');
        }

        setProducts(data);
      } catch (err) {
        console.error('Error fetching bundle products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Loading state
  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Best 상품을 세트로 저렴하게!
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg">
                <div className="aspect-square bg-gray-200 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Best 상품을 세트로 저렴하게!
            </h2>
            <p className="text-red-600">번들 상품을 불러오는데 실패했습니다: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Best 상품을 세트로 저렴하게!
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <div
              key={product.slug}
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
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback placeholder
                      e.target.src = '/api/placeholder/400/400';
                    }}
                  />
                  
                  {/* Hover Image */}
                  {/* <img 
                    src={product.hoverImage}
                    alt={`${product.title} - 호버 이미지`}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-100"
                    onError={(e) => {
                      // Fallback to main image if hover image fails
                      e.target.src = product.image;
                    }}
                  /> */}
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

                {/* CTA Button */}
                <a href={`/product/${product.slug}`}>
                  <button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105">
                    자세히 보기
                  </button>
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}