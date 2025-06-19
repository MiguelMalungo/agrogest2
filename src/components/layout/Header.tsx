import React from 'react'
import { useLocation } from 'react-router-dom'
import { useAppStore } from '@/stores/useAppStore'
import { cn } from '@/lib/utils'

const pageTitle = {
  '/hoje': 'Hoje',
  '/atividades': 'Atividades',
  '/inventario': 'Inventário',
  '/dashboard': 'Gestão',
  '/definicoes': 'Definições'
}

export const Header: React.FC = () => {
  const location = useLocation()
  const { user, isOnline } = useAppStore()
  
  const currentTitle = pageTitle[location.pathname as keyof typeof pageTitle] || 'AgroGest'
  const currentPath = location.pathname === '/' ? '/hoje' : location.pathname

  return (
    <header className="fixed top-0 left-0 right-0 z-30">
      {/* Backdrop blur effect */}
      <div className="absolute inset-0 bg-white/90 backdrop-blur-lg border-b border-gray-200" />
      
      {/* Header content */}
      <div className="relative z-10 px-4 pt-safe-area-inset-top">
        <div className="w-full md:w-[70%] mx-auto py-4">
          <div className="flex items-center justify-between">
            {/* Logo and connection status on the left */}
            <div className="flex items-center gap-4">
              <img 
                src={`${import.meta.env.BASE_URL}logo.png`}
                alt="AgroGest" 
                className="h-10 w-auto object-contain relative z-50"
              />
              <div className="flex items-center gap-2">
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  isOnline ? 'bg-green-400' : 'bg-red-400'
                )} />
                <span className="text-xs text-gray-600">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
            {/* Título e saudação à direita */}
            <div className="flex flex-col items-end">
              <h1 className="text-xl font-bold text-gray-800">
                {currentTitle}
              </h1>
              {user && (
                <p className="text-sm text-gray-600">
                  Olá, {user.nome.split(' ')[0]}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
