import React from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  variant?: 'default' | 'overlay'
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  variant = 'default',
  className,
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  
  const baseClasses = 'w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 text-base'
  
  const variants = {
    default: 'bg-white/70 backdrop-blur-sm border-gray-300 focus:border-green-500 focus:ring-green-500 text-black placeholder:text-gray-500 hover:bg-white/70 focus:bg-white/70',
    overlay: 'bg-white/20 backdrop-blur-sm border-white/30 focus:border-white focus:ring-white/50 text-black placeholder:text-gray-500'
  }

  // Remove hover/focus background color changes for default variant
  const cleanedVariants = {
    ...variants,
    default: variants.default.replace(/hover:bg-white\/70|focus:bg-white\/70/g, '')
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {label && (
        <label 
          htmlFor={inputId}
          className={cn(
            'block text-sm font-medium mb-2',
            variant === 'overlay' ? 'text-white' : 'text-gray-700'
          )}
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          id={inputId}
          className={cn(
            baseClasses,
            cleanedVariants[variant],
            icon && 'pl-10',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}

export default Input
