import React, { useState, useEffect } from 'react'
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
  const [scrolled, setScrolled] = useState(false)
  
  // Add scroll event listener to detect when user scrolls
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrolled])
  
  const currentTitle = pageTitle[location.pathname as keyof typeof pageTitle] || 'AgroGest'
  const currentPath = location.pathname === '/' ? '/hoje' : location.pathname

  return (
    <header className="fixed top-0 left-0 right-0 z-30 transition-all duration-300">
      {/* Backdrop blur effect - only visible when scrolled */}
      <div className={cn(
        "absolute inset-0 backdrop-blur-lg border-b transition-opacity duration-300",
        scrolled ? "opacity-100 bg-white/90 border-gray-200" : "opacity-0 border-transparent"
      )} />
      
      {/* Header content */}
      <div className="relative z-10 px-4 pt-safe-area-inset-top">
        <div className="w-full md:w-[70%] mx-auto py-4">
          <div className="flex items-center justify-between">
            {/* Logo and connection status on the left */}
            <div className="flex items-center gap-4">
              {/* Show white logo when not scrolled, regular logo when scrolled */}
              <img 
                src={`${import.meta.env.BASE_URL}${scrolled ? 'logo.png' : 'logo_white.png'}`}
                alt="AgroGest" 
                className="h-10 w-auto object-contain relative z-50 transition-opacity duration-300"
              />
              <div className="flex items-center gap-2">
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  isOnline ? 'bg-green-400' : 'bg-red-400'
                )} />
                <span className={cn(
                  "text-xs transition-colors",
                  scrolled ? "text-gray-600" : "text-white"
                )}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
            {/* Título e saudação à direita */}
            <div className="flex flex-col items-end">
              <h1 className={cn(
                "text-xl font-bold transition-colors",
                scrolled ? "text-gray-800" : "text-white"
              )}>
                {currentTitle}
              </h1>
              {user && (
                <p className={cn(
                  "text-sm transition-colors",
                  scrolled ? "text-gray-600" : "text-white"
                )}>
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
