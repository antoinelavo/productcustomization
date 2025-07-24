// /lib/utils.js

/**
 * Calculate current price from original price and discount percentage
 * @param {number} originalPrice - Original price in Korean Won
 * @param {number} discountPercentage - Discount percentage (0-100)
 * @returns {number} Current price rounded to nearest integer
 */
export function calculateCurrentPrice(originalPrice, discountPercentage = 0) {
  return Math.round(originalPrice * (100 - discountPercentage) / 100);
}

/**
 * Format price to Korean Won format with commas
 * @param {number} price - Price in Korean Won
 * @returns {string} Formatted price string
 */
export function formatPrice(price) {
  return new Intl.NumberFormat('ko-KR').format(price);
}

/**
 * Calculate savings amount
 * @param {number} originalPrice - Original price
 * @param {number} currentPrice - Current price
 * @returns {number} Savings amount
 */
export function calculateSavings(originalPrice, currentPrice) {
  return originalPrice - currentPrice;
}

/**
 * Check if product has discount
 * @param {number} discountPercentage - Discount percentage
 * @returns {boolean} True if product has discount
 */
export function hasDiscount(discountPercentage) {
  return discountPercentage > 0;
}

/**
 * Generate product URL from slug
 * @param {string} slug - Product slug
 * @returns {string} Product URL
 */
export function getProductUrl(slug) {
  return `/product/${slug}`;
}

/**
 * Validate quantity input
 * @param {number|string} quantity - Quantity to validate
 * @param {number} min - Minimum allowed quantity (default: 1)
 * @param {number} max - Maximum allowed quantity (default: 99)
 * @returns {number} Valid quantity number
 */
export function validateQuantity(quantity, min = 1, max = 99) {
  const num = parseInt(quantity);
  if (isNaN(num) || num < min) return min;
  if (num > max) return max;
  return num;
}