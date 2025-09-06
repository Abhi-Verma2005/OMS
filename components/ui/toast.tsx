"use client"

import React, { createContext, useContext, useReducer, useCallback, useMemo, useEffect, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

// Toast types
export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
}

interface ToastState {
  toasts: Toast[]
}

type ToastAction =
  | { type: 'ADD_TOAST'; payload: Toast }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'CLEAR_TOASTS' }

// Toast context
interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

// Toast reducer
function toastReducer(state: ToastState, action: ToastAction): ToastState {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, action.payload],
      }
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.payload),
      }
    case 'CLEAR_TOASTS':
      return {
        ...state,
        toasts: [],
      }
    default:
      return state
  }
}

// Toast provider
export function ToastProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(toastReducer, { toasts: [] })

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration || 5000,
    }
    
    dispatch({ type: 'ADD_TOAST', payload: newToast })

    // Auto remove toast after duration
    setTimeout(() => {
      dispatch({ type: 'REMOVE_TOAST', payload: id })
    }, newToast.duration)
  }, [])

  const removeToast = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id })
  }, [])

  const clearToasts = useCallback(() => {
    dispatch({ type: 'CLEAR_TOASTS' })
  }, [])

  const contextValue = useMemo(() => ({
    toasts: state.toasts,
    addToast,
    removeToast,
    clearToasts,
  }), [state.toasts, addToast, removeToast, clearToasts])

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

// Toast hook
export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// Toast container component
function ToastContainer() {
  const { toasts } = useToast()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  )
}

// Individual toast item
function ToastItem({ toast }: { toast: Toast }) {
  const { removeToast } = useToast()

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  }

  const Icon = icons[toast.type]

  const toastStyles = {
    success: 'toast-theme border-[#FDC800]',
    error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200',
    warning: 'toast-theme border-[#F2C86C]',
    info: 'toast-theme border-[#F2C86C]',
  }

  const iconStyles = {
    success: 'text-[#FDC800]',
    error: 'text-red-600 dark:text-red-400',
    warning: 'text-[#F2C86C]',
    info: 'text-[#F2C86C]',
  }

  return (
    <div
      className={cn(
        'max-w-sm w-full border rounded-lg p-4 transition-all duration-300 ease-in-out',
        'toast-enter backdrop-blur-sm shadow-lg',
        toastStyles[toast.type]
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', iconStyles[toast.type])} />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm">{toast.title}</h4>
          {toast.description && (
            <p className="text-sm opacity-90 mt-1">{toast.description}</p>
          )}
        </div>
        <button
          onClick={() => removeToast(toast.id)}
          className="flex-shrink-0 p-1 hover:bg-[#F2C86C]/20 rounded transition-colors text-[#986220]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
