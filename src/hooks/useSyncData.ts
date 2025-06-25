import { useEffect, useState, useCallback } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { syncService } from '../services/indexedDB';
import { taskService, inventoryService } from '../services/firebase';

/**
 * Hook para sincronização de dados entre o IndexedDB local e o Firebase
 * Implementa a estratégia offline-first com sincronização quando a conexão é restabelecida
 */
export const useSyncData = () => {
  const { isOnline, setOnlineStatus, lastSync, updateLastSync, user: currentUser } = useAppStore();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  
  // Sincronizar dados com o Firebase
  const syncData = useCallback(async () => {
    if (!isOnline || !currentUser || isSyncing) return false;
    
    try {
      setIsSyncing(true);
      setSyncError(null);
      
      // Sincronizar operações pendentes do IndexedDB com o Firebase
      const syncSuccess = await syncService.syncWithBackend();
      
      if (syncSuccess) {
        // Se a sincronização foi bem-sucedida, atualizar os dados locais com os dados do Firebase
        if (currentUser?.id) {
          // Buscar tarefas atualizadas
          const remoteTasks = await taskService.getAllTasks(currentUser.id);
          // Em uma implementação real, atualizaríamos o estado da aplicação
          console.log('Tarefas atualizadas:', remoteTasks.length);
          
          // Buscar inventário atualizado
          const remoteInventory = await inventoryService.getAllItems(currentUser.id);
          console.log('Inventário atualizado:', remoteInventory.length);
          
          // Atualizar timestamp da última sincronização
          updateLastSync();
        }
      }
      
      return syncSuccess;
    } catch (error) {
      console.error('Erro durante a sincronização:', error);
      setSyncError(error instanceof Error ? error.message : 'Erro desconhecido durante a sincronização');
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, currentUser, isSyncing, updateLastSync]);

  // Configurar listeners para eventos de conexão online/offline
  useEffect(() => {
    const handleOnline = () => {
      setOnlineStatus(true);
      // Tentar sincronizar quando ficar online
      syncData();
    };
    
    const handleOffline = () => {
      setOnlineStatus(false);
    };
    
    // Verificar estado inicial
    setOnlineStatus(syncService.isOnline());
    
    // Configurar listeners
    const cleanup = syncService.setupNetworkListeners(handleOnline, handleOffline);
    
    // Remover listeners quando o componente for desmontado
    return cleanup;
  }, [setOnlineStatus, syncData]);

  // Tentar sincronizar periodicamente quando estiver online
  useEffect(() => {
    let syncInterval: number | undefined;
    
    if (isOnline && currentUser) {
      // Tentar sincronizar a cada 5 minutos quando estiver online
      syncInterval = window.setInterval(() => {
        syncData();
      }, 5 * 60 * 1000);
    }
    
    return () => {
      if (syncInterval) {
        clearInterval(syncInterval);
      }
    };
  }, [isOnline, currentUser, syncData]);

  // Sincronizar quando o usuário mudar
  useEffect(() => {
    if (currentUser && isOnline) {
      syncData();
    }
  }, [currentUser, isOnline, syncData]);

  return {
    isSyncing,
    syncError,
    syncData,
    lastSyncTime: lastSync
  };
};