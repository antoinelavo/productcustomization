// lib/reviews.js
import { supabase } from '@/lib/supabase';

export async function getReviewsByProduct(productSlug, sortBy = 'newest') {
  let query = supabase
    .from('reviews')
    .select('*')
    .eq('product_slug', productSlug);

  // Apply sorting
  switch (sortBy) {
    case 'newest':
      query = query.order('review_date', { ascending: false });
      break;
    case 'oldest':
      query = query.order('review_date', { ascending: true });
      break;
    case 'highest':
      query = query.order('rating', { ascending: false });
      break;
    case 'lowest':
      query = query.order('rating', { ascending: true });
      break;
    case 'helpful':
      query = query.order('helpful_count', { ascending: false });
      break;
    default:
      query = query.order('review_date', { ascending: false });
  }

  const { data: reviews, error } = await query;

  if (error) {
    console.error('Error fetching reviews:', error);
    return { reviews: [], error };
  }

  return { reviews: reviews || [], error: null };
}

export function calculateReviewStats(reviews) {
  if (!reviews || reviews.length === 0) {
    return {
      avgRating: 0,
      totalReviews: 0,
      ratingDistribution: [5, 4, 3, 2, 1].map(rating => ({
        rating,
        count: 0,
        percentage: 0
      }))
    };
  }

  const avgRating = (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length);
  const totalReviews = reviews.length;
  
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(review => review.rating === rating).length,
    percentage: (reviews.filter(review => review.rating === rating).length / totalReviews) * 100
  }));

  return {
    avgRating: avgRating.toFixed(1),
    totalReviews,
    ratingDistribution
  };
}