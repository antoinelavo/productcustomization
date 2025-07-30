// @/components/ReviewsSection.jsx
import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, User, ChevronDown, ChevronUp, X} from 'lucide-react';
import { getReviewsByProduct, calculateReviewStats } from '@/lib/reviews';

export default function ReviewsSection({ productSlug }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch reviews when component mounts or sortBy changes
  useEffect(() => {
    async function fetchReviews() {
      setLoading(true);
      const { reviews: fetchedReviews, error } = await getReviewsByProduct(productSlug, sortBy);
      
      if (error) {
        setError('리뷰를 불러오는데 실패했습니다.');
      } else {
        setReviews(fetchedReviews);
        setError(null);
      }
      setLoading(false);
    }

    if (productSlug) {
      fetchReviews();
    }
  }, [productSlug, sortBy]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setSelectedImage(null);
      }
    };

    if (selectedImage) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);

  // Calculate review statistics
  const { avgRating, totalReviews, ratingDistribution } = calculateReviewStats(reviews);
  
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

  // Loading state
  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">리뷰를 불러오고 있습니다...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  // No reviews state
  if (reviews.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">고객 리뷰</h2>
          <div className="text-center py-12">
            <p className="text-gray-600">아직 리뷰가 없습니다.</p>
          </div>
        </div>
      </section>
    );
  }

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
                      <div className="font-semibold text-gray-900">{review.reviewer_name}</div>
                      {review.verified_purchase && (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                          구매 확인
                        </span>
                      )}
                      {review.source && review.source !== 'Website' && (
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                          {review.source}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">{review.review_date}</div>
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
                  {review.images && review.images.length > 0 && (
                    <div className="flex space-x-2 mb-4">
                      {review.images
                        .sort((a, b) => a.order - b.order) // Sort by order field
                        .map((image, index) => (
                          <img
                            key={index}
                            src={image.url}
                            alt={`리뷰 이미지 ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setSelectedImage(image.url)}
                          />
                        ))}
                    </div>
                  )}

                  {/* Helpful Button */}
                  <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    <ThumbsUp size={14} />
                    <span>도움이 됐어요 ({review.helpful_count})</span>
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

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-2"
            >
              <X size={24} />
            </button>
            
            {/* Full Size Image */}
            <img
              src={selectedImage}
              alt="리뷰 이미지 확대"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on image
            />
          </div>
        </div>
      )}
    </section>
  );
}