import React from 'react'
import { Outlet } from 'react-router-dom'
import TabBar from './TabBar'
import Header from './Header'
import { cn } from '@/lib/utils'
import { Bot } from 'lucide-react'

interface AppLayoutProps {
  children?: React.ReactNode
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fundo fixo de campos de milho */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}images/cornfield-background-blur.jpg)`, 
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover'
        }}
      />
      
      {/* Overlay verde escuro com blur conforme requisito */}
      <div className="fixed inset-0 z-10 bg-black/30 backdrop-blur-[8px]" />
      
      {/* Conteúdo da aplicação */}
      <div className="relative z-20 min-h-screen flex flex-col">
        {/* Header */}
        <Header />
        
        {/* Main content area */}
        <main className="flex-1 pt-20 pb-24 px-4 overflow-y-auto">
          <div className="w-full md:max-w-[70%] mx-auto">
            {children || <Outlet />}
          </div>
        </main>
        
        {/* Tab bar navigation */}
        <TabBar />

        {/* Floating Assist */}
        <button
          onClick={() => alert('Assistente em breve!')}
          aria-label="Assistente"
          className="fixed bottom-20 right-4 z-50 rounded-full w-14 h-14 shadow-md flex items-center justify-center bg-[#F5A926] hover:bg-orange-500 transition-colors border-2 border-white"
        >
          <Bot className="h-7 w-7 text-white" />
        </button>
      </div>
    </div>
  )
}

export default AppLayout
