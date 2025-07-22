// @/components/ProductDescription.jsx
import React from 'react';
import { Image } from 'lucide-react';

export default function ProductDescription() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">제품 상세 정보</h2>
        </div>

        {/* Product Description Image Placeholder */}
        <div className="bg-gray-200 rounded-2xl shadow-lg overflow-hidden">
          <div 
            className="w-full bg-gray-300 flex flex-col items-center justify-center text-gray-500"
            style={{ height: '1200px' }} // Long height for product description
          >
            <Image size={64} className="mb-4" />
            <h3 className="text-xl font-semibold mb-2">제품 상세 이미지</h3>
            <p className="text-center max-w-md">
              이곳에 제품 상세 이미지를 추가해주세요!
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}