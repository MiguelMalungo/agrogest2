import React, { useEffect } from 'react'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAppStore } from '@/stores/useAppStore'
import { useInitialData } from '@/hooks/useInitialData'
import { useSyncData } from '@/hooks/useSyncData'
import { AppLayout } from '@/components/layout/AppLayout'
import LandingPage from '@/pages/LandingPage'
import { HojePage } from '@/pages/HojePage'
import { AtividadesPage } from '@/pages/AtividadesPage'
import { InventarioPage } from '@/pages/InventarioPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { DefinicoesPage } from '@/pages/DefinicoesPage'
import CamposPage from '@/pages/CamposPage'
import FieldFormPage from '@/pages/FieldFormPage'
import { VoiceButton } from '@/components/ui/VoiceButton'

import { initDB } from '@/services/indexedDB'
import { Toaster } from '@/components/ui/toaster'

function App() {
  const { setOnlineStatus } = useAppStore()
  
  // Carregar dados iniciais
  useInitialData()

  // Inicializar o sincronizador de dados
  const { isSyncing, syncError, syncData } = useSyncData()

  // Inicializar o IndexedDB
  useEffect(() => {
    const initialize = async () => {
      try {
        await initDB()
        console.log('IndexedDB inicializado com sucesso!')
      } catch (error) {
        console.error('Erro ao inicializar IndexedDB:', error)
      }
    }

    initialize()
  }, [])

  useEffect(() => {
    // Monitor online/offline status
    const handleOnline = () => {
      setOnlineStatus(true)
      // Tentar sincronizar quando ficar online
      syncData()
    }
    const handleOffline = () => setOnlineStatus(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [setOnlineStatus, syncData])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<AppLayout />}>
          <Route path="/hoje" element={<HojePage />} />
          <Route path="/atividades" element={<AtividadesPage />} />
          <Route path="/inventario" element={<InventarioPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/definicoes" element={<DefinicoesPage />} />
          <Route path="/campos" element={<CamposPage />} />
          <Route path="/campos/novo" element={<FieldFormPage />} />
          <Route path="/campos/editar/:id" element={<FieldFormPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
