import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'floating'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  loading?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-agrogest-primary hover:bg-green-700 text-white shadow-lg hover:shadow-xl focus:ring-green-500',
    secondary: 'bg-agrogest-secondary hover:bg-orange-500 text-white shadow-lg hover:shadow-xl focus:ring-orange-400',
    outline: 'border border-agrogest-primary text-agrogest-primary hover:bg-agrogest-primary hover:text-white focus:ring-green-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-300',
    floating: 'bg-agrogest-secondary hover:bg-orange-500 text-white shadow-2xl hover:shadow-3xl rounded-full fixed bottom-20 right-4 z-50 focus:ring-orange-400'
  }
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
    icon: 'p-2 aspect-square'
  }
  
  const floatingSize = variant === 'floating' ? 'w-14 h-14' : sizes[size]

  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        floatingSize,
        loading && 'cursor-wait',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  )
}

// Export buttonVariants for compatibility with shadcn components
export const buttonVariants = (variant: string) => {
  const variants = {
    primary: 'bg-agrogest-primary hover:bg-green-700 text-white shadow-lg hover:shadow-xl focus:ring-green-500',
    secondary: 'bg-agrogest-secondary hover:bg-orange-500 text-white shadow-lg hover:shadow-xl focus:ring-orange-400',
    outline: 'border border-agrogest-primary text-agrogest-primary hover:bg-agrogest-primary hover:text-white focus:ring-green-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-300',
    default: 'bg-agrogest-primary hover:bg-green-700 text-white shadow-lg hover:shadow-xl focus:ring-green-500'
  }
  
  return `inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 text-base ${variants[variant as keyof typeof variants] || variants.default}`
}

export default Button
