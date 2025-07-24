// /contexts/CartContext.js
'use client'

import { createContext, useContext, useEffect, useReducer, useCallback } from 'react'

const CartContext = createContext({})

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

// Cart reducer function
function cartReducer(state, action) {
  switch (action.type) {
    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload,
        isLoading: false
      }
    
    case 'ADD_ITEM': {
  const { product, quantity, customization } = action.payload
  const cartItemId = generateCartItemId(product.id, customization)
  
  console.log('🔧 REDUCER: Adding', quantity, 'of', product.name)
  console.log('🔧 REDUCER: Current items:', state.items.length)
  console.log('🔧 REDUCER: Looking for cartItemId:', cartItemId)
  
  const existingItemIndex = state.items.findIndex(item => item.cartItemId === cartItemId)
  
  console.log('🔧 REDUCER: Existing item index:', existingItemIndex)
  
  if (existingItemIndex > -1) {
    // Update existing item
    const updatedItems = [...state.items]
    const oldQty = updatedItems[existingItemIndex].quantity
    updatedItems[existingItemIndex].quantity += quantity
    const newQty = updatedItems[existingItemIndex].quantity
    
    console.log('🔧 REDUCER: Updated existing item:', oldQty, '+', quantity, '=', newQty)
    return {
      ...state,
      items: updatedItems
    }
  } else {
    // Add new item
    console.log('🔧 REDUCER: Adding new item with qty:', quantity)
    const newItem = {
      cartItemId,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      currentPrice: product.current_price,
      originalPrice: product.original_price,
      image: product.main_image_url || `/images/FeaturedProducts/${product.slug}.png` || '/api/placeholder/80/80',      quantity,
      customization,
      addedAt: new Date().toISOString()
    }
    return {
      ...state,
      items: [...state.items, newItem]
    }
  }
}
    
    case 'UPDATE_QUANTITY': {
      const { cartItemId, newQuantity } = action.payload
      if (newQuantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.cartItemId !== cartItemId)
        }
      }
      return {
        ...state,
        items: state.items.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: newQuantity }
            : item
        )
      }
    }
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.cartItemId !== action.payload)
      }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      }
    
    default:
      return state
  }
}

// Helper function to generate cart item ID
function generateCartItemId(productId, customization) {
  const customizationString = JSON.stringify(customization)
  return `${productId}-${btoa(customizationString).replace(/[^a-zA-Z0-9]/g, '')}`
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isLoading: true
  })

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        const items = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: items })
      } else {
        dispatch({ type: 'LOAD_CART', payload: [] })
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
      dispatch({ type: 'LOAD_CART', payload: [] })
    }
  }, [])

useEffect(() => {
  if (!state.isLoading) {
    console.log('💾 Saving to localStorage:', state.items.length, 'items')
    state.items.forEach((item, index) => {
      console.log(`💾 Item ${index}: ${item.name} x${item.quantity}`)
    })
    try {
      localStorage.setItem('cart', JSON.stringify(state.items))
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
    }
  }
}, [state.items, state.isLoading])

  // Add item to cart
  const addToCart = useCallback((product, quantity = 1, customization = {}) => {
    console.log('Adding to cart:', product.name, 'qty:', quantity)
    dispatch({
      type: 'ADD_ITEM',
      payload: { product, quantity, customization }
    })
  }, [])

  // Update item quantity
  const updateQuantity = useCallback((cartItemId, newQuantity) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { cartItemId, newQuantity }
    })
  }, [])

  // Remove item from cart
  const removeFromCart = useCallback((cartItemId) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: cartItemId
    })
  }, [])

  // Clear entire cart
  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' })
  }, [])

  // Get cart totals
  const getCartTotals = useCallback(() => {
    const itemCount = state.items.reduce((total, item) => total + item.quantity, 0)
    const subtotal = state.items.reduce((total, item) => total + (item.currentPrice * item.quantity), 0)
    const shipping = subtotal >= 50000 ? 0 : 3000 // Free shipping over 50,000원
    const total = subtotal + shipping
    
    return {
      itemCount,
      subtotal,
      shipping,
      total,
      hasItems: state.items.length > 0
    }
  }, [state.items])

  const value = {
    cartItems: state.items,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotals,
    isLoading: state.isLoading
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}