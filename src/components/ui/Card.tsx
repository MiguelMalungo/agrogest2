import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'default' | 'overlay' | 'kpi'
  size?: 'sm' | 'md' | 'lg'
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  variant = 'default',
  size = 'md',
  ...props 
}) => {
  const baseClasses = 'rounded-xl border transition-all duration-200'
  
  const variants = {
    default: 'bg-white/65 backdrop-blur-sm border-gray-200 shadow-lg text-black dark:text-black',
    overlay: 'bg-white/65 backdrop-blur-md border-gray-200 shadow-xl text-black dark:text-black',
    kpi: 'bg-white/65 backdrop-blur-lg border-gray-200 shadow-2xl text-black dark:text-black'
  }
  
  const sizes = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  }

  return (
    <div
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
