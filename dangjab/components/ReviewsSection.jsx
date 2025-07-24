// @/components/ReviewsSection.jsx
import React, { useState } from 'react';
import { Star, ThumbsUp, User, ChevronDown, ChevronUp } from 'lucide-react';

export default function ReviewsSection({ product }) {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  // Sample reviews data
  const reviews = [
    {
      id: 1,
      name: '김**',
      rating: 5,
      date: '2024-12-15',
      title: '퀄리티가 정말 좋아요!',
      content: '우리 강아지 사진으로 만든 티셔츠인데 프린팅 품질이 너무 좋네요. 색상도 선명하고 원단도 부드러워요. 다음에 또 주문할 예정입니다.',
      helpful: 12,
      verified: true,
      images: ['/api/placeholder/100/100', '/api/placeholder/100/100']
    },
    {
      id: 2,
      name: '이**',
      rating: 4,
      date: '2024-12-10',
      title: '만족스러운 제품이에요',
      content: '디자인 그대로 잘 나왔고 배송도 빨랐어요. 다만 사이즈가 생각보다 약간 작은 것 같아요. 그래도 전반적으로 만족합니다!',
      helpful: 8,
      verified: true,
      images: ['/api/placeholder/100/100']
    },
    {
      id: 3,
      name: '박**',
      rating: 5,
      date: '2024-12-08',
      title: '선물로 주문했는데 너무 좋아해요',
      content: '친구 생일선물로 주문했는데 너무 좋아하더라구요. 포장도 깔끔하고 퀄리티도 기대 이상이었어요. 추천합니다!',
      helpful: 15,
      verified: true,
      images: []
    },
    {
      id: 4,
      name: '최**',
      rating: 4,
      date: '2024-12-05',
      title: '재주문 의사 있어요',
      content: '첫 주문이었는데 생각보다 만족스러워요. 프린팅이 깔끔하고 세탁 후에도 변형이 없네요.',
      helpful: 6,
      verified: true,
      images: ['/api/placeholder/100/100']
    },
    {
      id: 5,
      name: '장**',
      rating: 3,
      date: '2024-12-01',
      title: '보통이에요',
      content: '나쁘지 않은데 기대했던 것보다는 조금 아쉬워요. 색상이 화면과 약간 달라요.',
      helpful: 3,
      verified: true,
      images: []
    }
  ];

  const avgRating = (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1);
  const totalReviews = reviews.length;
  
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(review => review.rating === rating).length,
    percentage: (reviews.filter(review => review.rating === rating).length / totalReviews) * 100
  }));

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">고객 리뷰</h2>
          
          {/* Rating Summary */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Average Rating */}
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start space-x-4 mb-4">
                  <div className="text-5xl font-bold text-gray-900">{avgRating}</div>
                  <div>
                    <div className="flex space-x-1 mb-2">
                      {renderStars(Math.round(parseFloat(avgRating)))}
                    </div>
                    <div className="text-sm text-gray-600">{totalReviews}개의 리뷰</div>
                  </div>
                </div>
                <p className="text-gray-600">전체 고객 만족도</p>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-3">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 w-12">
                      <span className="text-sm font-medium">{rating}</span>
                      <Star size={14} className="text-yellow-400 fill-current" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-600 w-8">{count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-lg font-semibold text-gray-900">
              리뷰 ({totalReviews})
            </div>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">최신순</option>
              <option value="oldest">오래된순</option>
              <option value="highest">평점 높은순</option>
              <option value="lowest">평점 낮은순</option>
              <option value="helpful">도움순</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-8">
          {displayedReviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-8">
              <div className="flex items-start space-x-4">
                
                {/* User Avatar */}
                <div className="bg-gray-200 rounded-full p-3">
                  <User size={24} className="text-gray-600" />
                </div>

                {/* Review Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-4">
                      <div className="font-semibold text-gray-900">{review.name}</div>
                      {review.verified && (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                          구매 확인
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">{review.date}</div>
                  </div>

                  {/* Rating and Title */}
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex space-x-1">
                      {renderStars(review.rating)}
                    </div>
                    <div className="font-medium text-gray-900">{review.title}</div>
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-700 mb-4 leading-relaxed">{review.content}</p>

                  {/* Review Images */}
                  {review.images.length > 0 && (
                    <div className="flex space-x-2 mb-4">
                      {review.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`리뷰 이미지 ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                        />
                      ))}
                    </div>
                  )}

                  {/* Helpful Button */}
                  <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    <ThumbsUp size={14} />
                    <span>도움이 됐어요 ({review.helpful})</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show More/Less Button */}
        {reviews.length > 3 && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="inline-flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span>{showAllReviews ? '접기' : `더 보기 (${reviews.length - 3}개)`}</span>
              {showAllReviews ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}