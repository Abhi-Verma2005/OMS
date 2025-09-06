"use client"

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { Site } from '@/lib/sample-sites'
import { useToast } from '@/components/ui/toast'

// Cart item type
export interface CartItem {
  id: string
  site: Site
  quantity: number
  addedAt: Date
}

// Cart state type
interface CartState {
  items: CartItem[]
  isOpen: boolean
  isLoading: boolean
  error: string | null
}

// Cart actions
type CartAction =
  | { type: 'ADD_ITEM'; payload: { site: Site } }
  | { type: 'REMOVE_ITEM'; payload: { siteId: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_OPEN'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_CART'; payload: CartItem[] }

// Cart context type
interface CartContextType {
  state: CartState
  addItem: (site: Site) => void
  removeItem: (siteId: string) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  isItemInCart: (siteId: string) => boolean
}

// Initial state
const initialState: CartState = {
  items: [],
  isOpen: false,
  isLoading: false,
  error: null,
}

// Cart reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { site } = action.payload
      const existingItem = state.items.find(item => item.site.id === site.id)
      
      // If item already exists, don't add it again (only one quantity allowed)
      if (existingItem) {
        return state
      }
      
      return {
        ...state,
        items: [
          ...state.items,
          {
            id: `${site.id}-${Date.now()}`,
            site,
            quantity: 1, // Always set quantity to 1
            addedAt: new Date(),
          },
        ],
      }
    }
    
    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter(item => item.site.id !== action.payload.siteId),
      }
    }
    
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      }
    
    case 'SET_OPEN':
      return {
        ...state,
        isOpen: action.payload,
      }
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      }
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      }
    
    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload,
      }
    
    default:
      return state
  }
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Cart provider component
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const { addToast } = useToast()

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart).map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt),
        }))
        dispatch({ type: 'LOAD_CART', payload: parsedCart })
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(state.items))
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
    }
  }, [state.items])

  // Cart actions
  const addItem = (site: Site) => {
    dispatch({ type: 'ADD_ITEM', payload: { site } })
    
    // Show success toast
    addToast({
      type: 'success',
      title: 'Added to Cart!',
      description: `${site.name} has been added to your cart.`,
      duration: 3000,
    })
  }

  const removeItem = (siteId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { siteId } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const toggleCart = () => {
    dispatch({ type: 'SET_OPEN', payload: !state.isOpen })
  }

  const openCart = () => {
    dispatch({ type: 'SET_OPEN', payload: true })
  }

  const closeCart = () => {
    dispatch({ type: 'SET_OPEN', payload: false })
  }

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => {
      return total + (item.site.publishing.price * item.quantity)
    }, 0)
  }

  const isItemInCart = (siteId: string) => {
    return state.items.some(item => item.site.id === siteId)
  }

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    getTotalItems,
    getTotalPrice,
    isItemInCart,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
