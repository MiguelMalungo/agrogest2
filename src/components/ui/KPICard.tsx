import React from 'react'
import { cn } from '@/lib/utils'
import Card from './Card'

interface KPICardProps {
  title: string
  value: string | number
  unit?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  unit,
  icon,
  trend,
  className
}) => {
  return (
    <Card variant="kpi" className={cn('relative overflow-hidden', className)}>
      {/* Efeito de brilho sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <p className="text-sm text-gray-700 font-medium">{title}</p>
          </div>
          {icon && (
            <div className="text-agrogest-primary opacity-80">
              {icon}
            </div>
          )}
        </div>
        
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-2xl font-bold text-gray-800">
            {typeof value === 'number' ? value.toLocaleString('pt-PT') : value}
          </span>
          {unit && (
            <span className="text-sm text-gray-600 font-medium">{unit}</span>
          )}
        </div>
        
        {trend && (
          <div className="flex items-center gap-1">
            <div className={cn(
              'flex items-center text-xs font-medium',
              trend.isPositive ? 'text-green-600' : 'text-red-500'
            )}>
              <span className={cn(
                'mr-1',
                trend.isPositive ? '↗' : '↘'
              )}>
                {trend.isPositive ? '↗' : '↘'}
              </span>
              {Math.abs(trend.value)}%
            </div>
            <span className="text-xs text-gray-500">vs. semana anterior</span>
          </div>
        )}
      </div>
    </Card>
  )
}

export default KPICard
