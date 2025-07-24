// /pages/api/products/bundles.js
import { supabase } from '@/lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Fetch bundle products only
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', 'bundle')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ error: 'Failed to fetch bundle products' })
    }

    // Transform data to match component structure
    const transformedProducts = products.map(product => {
      const currentPrice = Math.round(product.original_price * (100 - product.discount_percentage) / 100)
      
      return {
        title: product.name,
        subtitle: product.description,
        image: `/images/SetPromotion/${getSetImageName(product.slug)}.png`,
        originalPrice: product.original_price.toString(),
        salePrice: currentPrice.toString(),
        badge: getBadgeForBundle(product),
        badgeColor: getBadgeColorForBundle(product),
        slug: product.slug
      }
    })

    return res.status(200).json(transformedProducts)

  } catch (error) {
    console.error('API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// Helper function to map product slugs to image names
function getSetImageName(slug) {
  const imageMap = {
    'best-2-tshirt-ecobag': 'set1',
    'best-2-tshirt-tumbler': 'set2', 
    'best-3-complete': 'set3'
  }
  return imageMap[slug] || 'set1'
}

// Helper function for bundle badges
function getBadgeForBundle(product) {
  if (product.slug.includes('best-3')) return '신상품'
  if (product.slug.includes('best-2')) return '베스트셀러'
  return '추천'
}

// Helper function for bundle badge colors
function getBadgeColorForBundle(product) {
  if (product.slug.includes('best-3')) return 'bg-blue-500'
  if (product.slug.includes('best-2')) return 'bg-red-500'
  return 'bg-gray-500'
}