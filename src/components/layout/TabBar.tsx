import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { TabItem, TabRoute } from '@/types'
import { Home, ClipboardList, Package, BarChart3, Settings } from 'lucide-react'

const tabItems: TabItem[] = [
  {
    route: 'hoje',
    label: 'Hoje',
    icon: <Home size={20} />,
    path: '/hoje'
  },
  {
    route: 'atividades',
    label: 'Atividades',
    icon: <ClipboardList size={20} />,
    path: '/atividades'
  },
  {
    route: 'inventario',
    label: 'Inventário',
    icon: <Package size={20} />,
    path: '/inventario'
  },
  {
    route: 'dashboard',
    label: 'Gestão',
    icon: <BarChart3 size={20} />,
    path: '/dashboard'
  },
  {
    route: 'definicoes',
    label: 'Definições',
    icon: <Settings size={20} />,
    path: '/definicoes'
  }
]

export const TabBar: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  const currentPath = location.pathname
  
  const handleTabClick = (path: string) => {
    navigate(path)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Backdrop blur effect */}
      <div className="absolute inset-0 bg-green-900/90 backdrop-blur-lg border-t border-green-700/50" />
      
      {/* Tab content */}
      <div className="relative z-10 flex items-center justify-around px-2 py-3 safe-area-inset-bottom">
        {tabItems.map((tab) => {
          const isActive = currentPath === tab.path || 
            (currentPath === '/' && tab.path === '/hoje')
          
          return (
            <button
              key={tab.route}
              onClick={() => handleTabClick(tab.path)}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-0',
                isActive 
                  ? 'bg-white/20 text-white' 
                  : 'text-green-100 hover:text-white hover:bg-white/10'
              )}
            >
              <span className="flex items-center justify-center">{tab.icon}</span>
              <span className="text-xs font-medium truncate max-w-16">
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default TabBar
