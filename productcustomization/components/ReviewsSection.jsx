import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, User, ChevronDown, ChevronUp, X } from 'lucide-react';

// Sample hardcoded reviews data
const sampleReviews = [
  {
    id: 1,
    reviewer_name: "김민수",
    rating: 5,
    title: "정말 만족스러운 제품입니다!",
    content: "배송도 빠르고 품질도 기대 이상이에요. 특히 디자인이 정말 마음에 들고 사용감도 훌륭합니다. 다음에도 이 브랜드 제품을 구매할 예정입니다.",
    review_date: "2024-01-15",
    verified_purchase: true,
    source: "Website",
    helpful_count: 12,
    images: [
      { url: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop", order: 1 }
    ]
  },
  {
    id: 2,
    reviewer_name: "이지현",
    rating: 4,
    title: "가성비 좋아요",
    content: "가격 대비 품질이 좋습니다. 몇 가지 아쉬운 부분이 있지만 전반적으로 만족합니다. 특히 고객 서비스가 정말 친절하고 빨라서 좋았어요.",
    review_date: "2024-01-10",
    verified_purchase: true,
    source: "Website",
    helpful_count: 8,
    images: []
  },
  {
    id: 3,
    reviewer_name: "박성호",
    rating: 5,
    title: "최고입니다!",
    content: "이런 제품을 찾고 있었는데 드디어 찾았네요. 품질, 디자인, 가격 모든 면에서 완벽합니다. 주변 사람들에게도 추천하고 있어요.",
    review_date: "2024-01-08",
    verified_purchase: false,
    source: "Naver",
    helpful_count: 15,
    images: [
      { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop", order: 1 }
    ]
  },
  {
    id: 4,
    reviewer_name: "최윤아",
    rating: 3,
    title: "보통이에요",
    content: "나쁘지는 않지만 특별히 좋지도 않아요. 기대했던 것보다는 조금 아쉬웠습니다. 그래도 사용하는데 문제는 없어요.",
    review_date: "2024-01-05",
    verified_purchase: true,
    source: "Website",
    helpful_count: 3,
    images: []
  },
  {
    id: 5,
    reviewer_name: "정수빈",
    rating: 5,
    title: "완벽한 선택이었습니다",
    content: "정말 오랫동안 고민하다가 구매했는데 후회 없는 선택이었어요. 품질도 좋고 디자인도 예쁘고, 무엇보다 실용적이에요. 강력 추천합니다!",
    review_date: "2024-01-03",
    verified_purchase: true,
    source: "Website",
    helpful_count: 9,
    images: [
      { url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop", order: 1 },
      { url: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop", order: 2 }
    ]
  },
  {
    id: 6,
    reviewer_name: "한동욱",
    rating: 4,
    title: "만족합니다",
    content: "전체적으로 만족스럽습니다. 몇 가지 개선점이 있으면 더 좋겠지만, 현재로서는 충분히 만족하고 있어요. 배송도 생각보다 빨랐습니다.",
    review_date: "2024-01-01",
    verified_purchase: true,
    source: "Website",
    helpful_count: 6,
    images: []
  }
];

// Calculate review statistics
function calculateReviewStats(reviews) {
  if (!reviews || reviews.length === 0) {
    return {
      avgRating: '0.0',
      totalReviews: 0,
      ratingDistribution: [
        { rating: 5, count: 0, percentage: 0 },
        { rating: 4, count: 0, percentage: 0 },
        { rating: 3, count: 0, percentage: 0 },
        { rating: 2, count: 0, percentage: 0 },
        { rating: 1, count: 0, percentage: 0 }
      ]
    };
  }

  const total = reviews.length;
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const avgRating = (totalRating / total).toFixed(1);

  const distribution = [5, 4, 3, 2, 1].map(rating => {
    const count = reviews.filter(review => review.rating === rating).length;
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return { rating, count, percentage };
  });

  return {
    avgRating,
    totalReviews: total,
    ratingDistribution: distribution
  };
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState(sampleReviews);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedImage, setSelectedImage] = useState(null);
  
  // States for write review modal
  const [showWriteReviewModal, setShowWriteReviewModal] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    title: '',
    content: ''
  });

  // Sort reviews when sortBy changes
  useEffect(() => {
    const sortedReviews = [...sampleReviews].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.review_date) - new Date(a.review_date);
        case 'oldest':
          return new Date(a.review_date) - new Date(b.review_date);
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'helpful':
          return b.helpful_count - a.helpful_count;
        default:
          return 0;
      }
    });
    setReviews(sortedReviews);
  }, [sortBy]);

  // Handle escape key to close modals
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (selectedImage) {
          setSelectedImage(null);
        } else if (showWriteReviewModal) {
          setShowWriteReviewModal(false);
        }
      }
    };

    if (selectedImage || showWriteReviewModal) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage, showWriteReviewModal]);

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

  const renderInteractiveStars = (currentRating, onRatingChange) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={24}
        className={`cursor-pointer transition-colors ${
          index < currentRating ? 'text-yellow-400 fill-current' : 'text-gray-300 hover:text-yellow-300'
        }`}
        onClick={() => onRatingChange(index + 1)}
      />
    ));
  };

  const handleWriteReview = () => {
    setShowWriteReviewModal(true);
    setSubmitMessage({ type: '', text: '' });
    setReviewForm({
      rating: 0,
      title: '',
      content: ''
    });
  };

  const handleFormChange = (field, value) => {
    setReviewForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitReview = async () => {
    
    // Basic validation
    if (!reviewForm.rating || !reviewForm.title.trim() || !reviewForm.content.trim()) {
      setSubmitMessage({ type: 'error', text: '모든 필드를 입력해주세요.' });
      return;
    }

    if (reviewForm.title.length > 30) {
      setSubmitMessage({ type: 'error', text: '제목은 30자 이내로 입력해주세요.' });
      return;
    }

    setSubmittingReview(true);
    setSubmitMessage({ type: '', text: '' });

    // Simulate API call
    setTimeout(() => {
      const newReview = {
        id: reviews.length + 1,
        reviewer_name: "새로운 사용자",
        rating: reviewForm.rating,
        title: reviewForm.title.trim(),
        content: reviewForm.content.trim(),
        review_date: new Date().toISOString().split('T')[0],
        verified_purchase: true,
        source: "Website",
        helpful_count: 0,
        images: []
      };

      setReviews(prev => [newReview, ...prev]);
      setSubmittingReview(false);
      setSubmitMessage({ type: 'success', text: '리뷰가 성공적으로 작성되었습니다!' });
      
      // Close modal after 3 seconds
      setTimeout(() => {
        setShowWriteReviewModal(false);
      }, 3000);
    }, 2000);
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

          {/* Sort Options and Write Review Button */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-lg font-semibold text-gray-900">
              리뷰 ({totalReviews})
            </div>
            <div className="flex items-center space-x-4">
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
              <button
                onClick={handleWriteReview}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                리뷰 작성
              </button>
            </div>
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
                        .sort((a, b) => a.order - b.order)
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

      {/* Write Review Modal */}
      {showWriteReviewModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowWriteReviewModal(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">리뷰 작성</h3>
                <button
                  onClick={() => setShowWriteReviewModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Submit Message */}
              {submitMessage.text && (
                <div className={`mb-4 p-4 rounded-lg ${
                  submitMessage.type === 'success' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {submitMessage.text}
                </div>
              )}

              {/* Review Form */}
              <div className="space-y-6">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    평점 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex space-x-1">
                    {renderInteractiveStars(reviewForm.rating, (rating) => handleFormChange('rating', rating))}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {reviewForm.rating > 0 ? `${reviewForm.rating}점` : '평점을 선택해주세요'}
                  </p>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    제목 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={reviewForm.title}
                      onChange={(e) => handleFormChange('title', e.target.value)}
                      placeholder="리뷰 제목을 입력해주세요"
                      maxLength={30}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="absolute right-3 top-3 text-sm text-gray-400">
                      {reviewForm.title.length}/30
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    내용 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={reviewForm.content}
                    onChange={(e) => handleFormChange('content', e.target.value)}
                    placeholder="제품에 대한 자세한 리뷰를 작성해주세요"
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowWriteReviewModal(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    disabled={submittingReview}
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitReview}
                    disabled={submittingReview}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {submittingReview && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    )}
                    <span>{submittingReview ? '작성 중...' : '리뷰 작성'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-2"
            >
              <X size={24} />
            </button>
            
            <img
              src={selectedImage}
              alt="리뷰 이미지 확대"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </section>
  );
}