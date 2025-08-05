// /components/ProductDescription.jsx
import React from 'react';
import { Image, Play } from 'lucide-react';

export default function ProductDescription({ product }) {
  // Placeholder video data
  const videos = [
    { id: 1, title: '제품 소개 영상', duration: '2:30' },
    { id: 2, title: '사용법 가이드', duration: '1:45' },
    { id: 3, title: '품질 테스트', duration: '3:20' },
    { id: 4, title: '고객 후기', duration: '2:15' },
    { id: 5, title: '제작 과정', duration: '4:10' },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Video Section */}
        <div className="mb-16">
          {/* Video Section Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">제품 영상</h2>
            <p className="text-gray-600">제품에 대한 다양한 영상을 확인해보세요</p>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {videos.map((video) => (
              <div key={video.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Video Thumbnail Placeholder */}
                <div className="relative bg-gray-300 aspect-[4/3] flex items-center justify-center cursor-pointer group">
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="bg-white/90 rounded-full p-3">
                      <Play className="w-6 h-6 text-gray-800 fill-current" />
                    </div>
                  </div>
                  
                  {/* Placeholder Content */}
                  <div className="text-gray-500 text-center">
                    <Play size={32} className="mx-auto mb-2" />
                    <span className="text-sm font-medium">영상 {video.id}</span>
                  </div>
                  
                  {/* Duration Badge */}
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                
                {/* Video Info */}
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 text-sm truncate">
                    {video.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Details Section */}
        <div>
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">제품 상세 정보</h2>
          </div>

          {/* Product Description Image Placeholder */}
          <div className="bg-gray-200 rounded-2xl shadow-lg overflow-hidden">
            <div 
              className="w-full bg-gray-300 flex flex-col items-center justify-center text-gray-500"
              style={{ height: '1200px' }}
            >
              <Image size={64} className="mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {product?.name ? `${product.name} 상세 이미지` : '제품 상세 이미지'}
              </h3>
              <p className="text-center max-w-md">
                이곳에 제품의 상세한 설명과 이미지가 들어갑니다.
                <br />
                품질, 소재, 관리방법 등의 정보를 포함합니다.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}