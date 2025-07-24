// /pages/api/products/featured.js
import { supabase } from '@/lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Fetch featured products (individual products only, not bundles)
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', 'individual')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ error: 'Failed to fetch products' })
    }

    // Transform data to match component structure
    const transformedProducts = products.map(product => {
      const currentPrice = Math.round(product.original_price * (100 - product.discount_percentage) / 100)
      
      return {
        title: product.name,
        subtitle: product.description,
        image: `/images/FeaturedProducts/${product.slug}.png`,
        hoverImage: `/images/FeaturedProducts/${product.slug}-hover.png`,
        originalPrice: product.original_price.toString(),
        salePrice: currentPrice.toString(),
        badge: getBadgeForProduct(product),
        badgeColor: getBadgeColorForProduct(product),
        slug: product.slug
      }
    })

    return res.status(200).json(transformedProducts)

  } catch (error) {
    console.error('API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// Helper function to determine badge based on product
function getBadgeForProduct(product) {
  if (product.slug === 'tshirt') return '베스트셀러'
  if (product.slug === 'tumbler') return '신상품' 
  if (product.slug === 'mug') return '인기'
  if (product.slug === 'ecobag') return '빠른제작'
  return '추천'
}

// Helper function to determine badge color
function getBadgeColorForProduct(product) {
  if (product.slug === 'tshirt') return 'bg-red-500'
  if (product.slug === 'tumbler') return 'bg-blue-500'
  if (product.slug === 'mug') return 'bg-pink-500'
  if (product.slug === 'ecobag') return 'bg-green-500'
  return 'bg-gray-500'
}