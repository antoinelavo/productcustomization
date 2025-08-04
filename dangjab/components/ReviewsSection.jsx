// @/components/ReviewsSection.jsx
import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, User, ChevronDown, ChevronUp, X } from 'lucide-react';
import { getReviewsByProduct, calculateReviewStats, submitReview } from '@/lib/reviews';

export default function ReviewsSection({ productSlug }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedImage, setSelectedImage] = useState(null);
  
  // New states for write review modal
  const [showWriteReviewModal, setShowWriteReviewModal] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    title: '',
    content: ''
  });

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

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
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

    const result = await submitReview({
      productSlug,
      rating: reviewForm.rating,
      title: reviewForm.title.trim(),
      content: reviewForm.content.trim()
    });

    setSubmittingReview(false);

    if (result.success) {
      setSubmitMessage({ type: 'success', text: '리뷰가 성공적으로 작성되었습니다!' });
      
      // Refresh reviews list
      const { reviews: updatedReviews } = await getReviewsByProduct(productSlug, sortBy);
      setReviews(updatedReviews || []);
      
      // Close modal after 3 seconds
      setTimeout(() => {
        setShowWriteReviewModal(false);
      }, 3000);
    } else {
      setSubmitMessage({ type: 'error', text: result.error });
    }
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
            <p className="text-gray-600 mb-6">아직 리뷰가 없습니다.</p>
            <button
              onClick={handleWriteReview}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              첫 번째 리뷰 작성하기
            </button>
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
              <form onSubmit={handleSubmitReview} className="space-y-6">
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
                    type="submit"
                    disabled={submittingReview}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {submittingReview && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    )}
                    <span>{submittingReview ? '작성 중...' : '리뷰 작성'}</span>
                  </button>
                </div>
              </form>
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