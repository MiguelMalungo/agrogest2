import React, { useState } from 'react'
import { useAppStore } from '@/stores/useAppStore'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { User, RefreshCcw, Save, Bell, Info, HelpCircle, LogOut, BarChart2, Wrench, Upload, Download, Trash2 } from 'lucide-react';

export const DefinicoesPage: React.FC = () => {
  const { user, isOnline, lastSync, logout } = useAppStore()
  const [showUserForm, setShowUserForm] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  
  const menuItems = [
    {
      id: 'profile',
      title: 'Perfil do Utilizador',
      description: 'Gerir informações pessoais e da fazenda',
      icon: <User className="w-6 h-6" />, 
      action: () => setShowUserForm(true)
    },
    {
      id: 'sync',
      title: 'Sincronização',
      description: `Última sincronização: ${lastSync ? lastSync.toLocaleString('pt-PT') : 'Nunca'}`,
      icon: <RefreshCcw className="w-6 h-6" />, 
      action: () => {} // Implementar sincronização
    },
    {
      id: 'backup',
      title: 'Cópia de Segurança',
      description: 'Exportar dados para backup',
      icon: <Save className="w-6 h-6" />, 
      action: () => {} // Implementar backup
    },
    {
      id: 'notifications',
      title: 'Notificações',
      description: 'Configurar alertas e lembretes',
      icon: <Bell className="w-6 h-6" />, 
      action: () => {} // Implementar notificações
    },
    {
      id: 'about',
      title: 'Sobre a AgroGest',
      description: 'Informações da aplicação',
      icon: <Info className="w-6 h-6" />, 
      action: () => setShowAbout(true)
    },
    {
      id: 'help',
      title: 'Ajuda e Suporte',
      description: 'Documentação e contacto',
      icon: <HelpCircle className="w-6 h-6" />, 
      action: () => {} // Implementar ajuda
    }
  ]

  const handleLogout = () => {
    if (confirm('Tem certeza que deseja terminar sessão?')) {
      logout()
    }
  }

  const handleDataExport = () => {
    // Implementar exportação de dados
    alert('Funcionalidade em desenvolvimento')
  }

  const handleDataImport = () => {
    // Implementar importação de dados
    alert('Funcionalidade em desenvolvimento')
  }

  return (
    <div className="space-y-6">
      {/* Informações do utilizador */}
      <Card variant="overlay" className="text-black">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-2xl">
            {user?.nome.charAt(0).toUpperCase() || <User className="w-8 h-8" />}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold">
              {user?.nome || 'Utilizador Anónimo'}
            </h2>
            <p className="text-green-100">{user?.email || 'Não autenticado'}</p>
            {user?.fazenda && (
              <p className="text-sm text-green-200">{user.fazenda}</p>
            )}
          </div>
          <div className="text-right">
            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'} mb-1`} />
            <span className="text-xs text-green-100">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </Card>

      {/* Status da aplicação */}
      <Card variant="overlay" className="text-black">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <BarChart2 className="w-5 h-5" />
          Estado da Aplicação
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-green-100">Versão:</span>
            <span className="font-medium">1.0.0 (MVP)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-100">Modo PWA:</span>
            <span className="font-medium">
              {window.matchMedia('(display-mode: standalone)').matches ? 'Ativo' : 'Browser'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-100">Armazenamento local:</span>
            <span className="font-medium">Ativo</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-100">Service Worker:</span>
            <span className="font-medium">
              {'serviceWorker' in navigator ? 'Suportado' : 'Não suportado'}
            </span>
          </div>
        </div>
      </Card>

      {/* Menu de definições */}
      <div className="space-y-3">
        {menuItems.map(item => (
          <Card 
            key={item.id}
            variant="overlay" 
            className="cursor-pointer text-black"
            onClick={item.action}
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1">
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-green-100">{item.description}</p>
              </div>
              <span className="text-green-300">→</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Gestão de dados */}
      <Card variant="overlay" className="text-black">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Wrench className="w-5 h-5" />
          Gestão de Dados
        </h3>
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full text-white border-white/30 hover:bg-white/10"
            onClick={handleDataExport}
          >
            <Upload className="inline w-5 h-5 mr-2 align-text-bottom" />Exportar Dados
          </Button>
          <Button
            variant="outline"
            className="w-full text-white border-white/30 hover:bg-white/10"
            onClick={handleDataImport}
          >
            <Download className="inline w-5 h-5 mr-2 align-text-bottom" />Importar Dados
          </Button>
          <Button
            variant="outline"
            className="w-full text-yellow-300 border-yellow-300/30 hover:bg-yellow-500/10"
            onClick={() => {
              if (confirm('Esta ação irá eliminar todos os dados locais. Continuar?')) {
                localStorage.clear()
                window.location.reload()
              }
            }}
          >
            <Trash2 className="inline w-5 h-5 mr-2 align-text-bottom" />Limpar Dados Locais
          </Button>
        </div>
      </Card>

      {/* Botão de logout */}
      {user && (
        <Button
          variant="outline"
          className="w-full text-red-300 border-red-300/30 hover:bg-red-500/10"
          onClick={handleLogout}
        >
          <LogOut className="inline w-5 h-5 mr-2 align-text-bottom" />Terminar Sessão
        </Button>
      )}

      {/* Modal: Sobre a aplicação */}
      {showAbout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAbout(false)} />
          <Card variant="overlay" className="relative max-w-md w-full max-h-96 overflow-y-auto text-black">
            <div className="text-center mb-4">
              <img src="/logo.png" alt="AgroGest" className="w-16 h-16 mx-auto mb-4 rounded-full" />
              <h2 className="text-xl font-bold">AgroGest PWA</h2>
              <p className="text-green-100">Versão 1.0.0 (MVP)</p>
            </div>
            
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-semibold mb-2">Sobre</h3>
                <p className="text-green-100">
                  A AgroGest é uma aplicação Progressive Web App (PWA) desenvolvida para 
                  auxiliar agricultores na gestão de tarefas, inventário e monitorização 
                  de atividades agrícolas.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Funcionalidades</h3>
                <ul className="text-green-100 space-y-1">
                  <li>• Planeamento e gestão de tarefas</li>
                  <li>• Controlo de inventário</li>
                  <li>• Dashboard com métricas</li>
                  <li>• Funcionamento offline</li>
                  <li>• Interface adaptada a dispositivos móveis</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Tecnologias</h3>
                <p className="text-green-100">
                  React + TypeScript, Tailwind CSS, Zustand, PWA, IndexedDB
                </p>
              </div>
            </div>
            
            <Button
              variant="secondary"
              className="w-full mt-6"
              onClick={() => setShowAbout(false)}
            >
              Fechar
            </Button>
          </Card>
        </div>
      )}

      {/* Modal: Perfil do utilizador */}
      {showUserForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowUserForm(false)} />
          <Card variant="overlay" className="relative max-w-md w-full text-black">
            <h2 className="text-xl font-bold mb-4">Perfil do Utilizador</h2>
            
            <div className="space-y-4">
              <Input
                label="Nome completo"
                value={user?.nome || ''}
                variant="overlay"
                placeholder="Introduza o seu nome"
              />
              <Input
                label="Email"
                type="email"
                value={user?.email || ''}
                variant="overlay"
                placeholder="Introduza o seu email"
              />
              <Input
                label="Nome da fazenda"
                value={user?.fazenda || ''}
                variant="overlay"
                placeholder="Introduza o nome da fazenda"
              />
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setShowUserForm(false)}
              >
                Guardar
              </Button>
              <Button
                variant="outline"
                className="flex-1 text-white border-white/30 hover:bg-white/10"
                onClick={() => setShowUserForm(false)}
              >
                Cancelar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default DefinicoesPage
