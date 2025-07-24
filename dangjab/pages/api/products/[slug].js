// /pages/api/products/[slug].js
import { supabase } from '@/lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { slug } = req.query

  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: 'Product slug is required' })
  }

  try {
    // Fetch product by slug
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error) {
      console.error('Supabase error:', error)
      
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Product not found' })
      }
      
      return res.status(500).json({ error: 'Failed to fetch product' })
    }

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    // Calculate current price
    const currentPrice = Math.round(product.original_price * (100 - product.discount_percentage) / 100)

    // Add calculated fields to product
    const productWithCalculatedFields = {
      ...product,
      current_price: currentPrice,
      savings: product.original_price - currentPrice,
      has_discount: product.discount_percentage > 0
    }

    return res.status(200).json(productWithCalculatedFields)

  } catch (error) {
    console.error('API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}