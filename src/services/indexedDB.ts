import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Task, InventoryItem, Field } from '../types';

/**
 * Interface do esquema do banco de dados IndexedDB
 */
interface AgroGestDB extends DBSchema {
  tasks: {
    key: string;
    value: Task;
    indexes: { 'by-status': string; 'by-date': string; 'by-field': string };
  };
  inventory: {
    key: string;
    value: InventoryItem;
    indexes: { 'by-type': string; 'by-stock': number };
  };
  fields: {
    key: string;
    value: Field;
  };
  syncQueue: {
    key: string;
    value: {
      id: string;
      operation: 'create' | 'update' | 'delete';
      storeName: 'tasks' | 'inventory' | 'fields';
      data: any;
      timestamp: number;
    };
  };
}

// Nome e versão do banco de dados
const DB_NAME = 'agrogest-db';
const DB_VERSION = 1;

/**
 * Inicializa o banco de dados IndexedDB
 */
export const initDB = async (): Promise<IDBPDatabase<AgroGestDB>> => {
  return openDB<AgroGestDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Criar store de tarefas
      if (!db.objectStoreNames.contains('tasks')) {
        const taskStore = db.createObjectStore('tasks', { keyPath: 'id' });
        taskStore.createIndex('by-status', 'status');
        taskStore.createIndex('by-date', 'scheduledDate');
        taskStore.createIndex('by-field', 'fieldId');
      }

      // Criar store de inventário
      if (!db.objectStoreNames.contains('inventory')) {
        const inventoryStore = db.createObjectStore('inventory', { keyPath: 'id' });
        inventoryStore.createIndex('by-type', 'type');
        inventoryStore.createIndex('by-stock', 'currentStock');
      }

      // Criar store de campos
      if (!db.objectStoreNames.contains('fields')) {
        db.createObjectStore('fields', { keyPath: 'id' });
      }

      // Criar store de fila de sincronização
      if (!db.objectStoreNames.contains('syncQueue')) {
        db.createObjectStore('syncQueue', { keyPath: 'id' });
      }
    },
  });
};

// Instância do banco de dados
let dbPromise: Promise<IDBPDatabase<AgroGestDB>>;

/**
 * Obtém a instância do banco de dados, inicializando-o se necessário
 */
const getDB = (): Promise<IDBPDatabase<AgroGestDB>> => {
  if (!dbPromise) {
    dbPromise = initDB();
  }
  return dbPromise;
};

/**
 * API para operações com tarefas
 */
export const taskDB = {
  getAll: async (): Promise<Task[]> => {
    const db = await getDB();
    return db.getAll('tasks');
  },

  getByStatus: async (status: string): Promise<Task[]> => {
    const db = await getDB();
    return db.getAllFromIndex('tasks', 'by-status', status);
  },

  getByField: async (fieldId: string): Promise<Task[]> => {
    const db = await getDB();
    return db.getAllFromIndex('tasks', 'by-field', fieldId);
  },

  getByDate: async (date: string): Promise<Task[]> => {
    const db = await getDB();
    // Obter todas as tarefas
    const allTasks = await db.getAll('tasks');
    
    // Converter a data de entrada para objeto Date e extrair apenas a parte da data (sem hora)
    const targetDate = new Date(date);
    const targetDateString = targetDate.toISOString().split('T')[0];
    
    // Filtrar tarefas por data
    return allTasks.filter(task => {
      // Verificar se a dataExecucao existe e é uma data válida
      if (task.dataExecucao) {
        // Converter para string de data apenas (sem hora)
        const taskDate = new Date(task.dataExecucao);
        const taskDateString = taskDate.toISOString().split('T')[0];
        return taskDateString === targetDateString;
      }
      return false;
    });
  },

  add: async (task: Task): Promise<string> => {
    const db = await getDB();
    await db.put('tasks', task);
    // Adicionar à fila de sincronização
    await syncQueueDB.add({
      id: `task-${Date.now()}`,
      operation: 'create',
      storeName: 'tasks',
      data: task,
      timestamp: Date.now(),
    });
    return task.id;
  },

  update: async (task: Task): Promise<void> => {
    const db = await getDB();
    await db.put('tasks', task);
    // Adicionar à fila de sincronização
    await syncQueueDB.add({
      id: `task-update-${Date.now()}`,
      operation: 'update',
      storeName: 'tasks',
      data: task,
      timestamp: Date.now(),
    });
  },

  delete: async (id: string): Promise<void> => {
    const db = await getDB();
    await db.delete('tasks', id);
    // Adicionar à fila de sincronização
    await syncQueueDB.add({
      id: `task-delete-${Date.now()}`,
      operation: 'delete',
      storeName: 'tasks',
      data: { id },
      timestamp: Date.now(),
    });
  },
};

/**
 * API para operações com inventário
 */
export const inventoryDB = {
  getAll: async (): Promise<InventoryItem[]> => {
    const db = await getDB();
    return db.getAll('inventory');
  },

  getByType: async (type: string): Promise<InventoryItem[]> => {
    const db = await getDB();
    return db.getAllFromIndex('inventory', 'by-type', type);
  },

  getLowStock: async (threshold: number): Promise<InventoryItem[]> => {
    const db = await getDB();
    // Obter todos os itens
    const allItems = await db.getAll('inventory');
    
    // Filtrar por quantidade abaixo do limite
    return allItems.filter(item => item.quantidade <= threshold);
  },

  add: async (item: InventoryItem): Promise<string> => {
    const db = await getDB();
    await db.put('inventory', item);
    // Adicionar à fila de sincronização
    await syncQueueDB.add({
      id: `inventory-${Date.now()}`,
      operation: 'create',
      storeName: 'inventory',
      data: item,
      timestamp: Date.now(),
    });
    return item.id;
  },

  update: async (item: InventoryItem): Promise<void> => {
    const db = await getDB();
    await db.put('inventory', item);
    // Adicionar à fila de sincronização
    await syncQueueDB.add({
      id: `inventory-update-${Date.now()}`,
      operation: 'update',
      storeName: 'inventory',
      data: item,
      timestamp: Date.now(),
    });
  },

  delete: async (id: string): Promise<void> => {
    const db = await getDB();
    await db.delete('inventory', id);
    // Adicionar à fila de sincronização
    await syncQueueDB.add({
      id: `inventory-delete-${Date.now()}`,
      operation: 'delete',
      storeName: 'inventory',
      data: { id },
      timestamp: Date.now(),
    });
  },
};

/**
 * API para operações com campos
 */
export const fieldDB = {
  getAll: async (): Promise<Field[]> => {
    const db = await getDB();
    return db.getAll('fields');
  },

  get: async (id: string): Promise<Field | undefined> => {
    const db = await getDB();
    return db.get('fields', id);
  },

  add: async (field: Field): Promise<string> => {
    const db = await getDB();
    await db.put('fields', field);
    // Adicionar à fila de sincronização
    await syncQueueDB.add({
      id: `field-${Date.now()}`,
      operation: 'create',
      storeName: 'fields',
      data: field,
      timestamp: Date.now(),
    });
    return field.id;
  },

  update: async (field: Field): Promise<void> => {
    const db = await getDB();
    await db.put('fields', field);
    // Adicionar à fila de sincronização
    await syncQueueDB.add({
      id: `field-update-${Date.now()}`,
      operation: 'update',
      storeName: 'fields',
      data: field,
      timestamp: Date.now(),
    });
  },

  delete: async (id: string): Promise<void> => {
    const db = await getDB();
    await db.delete('fields', id);
    // Adicionar à fila de sincronização
    await syncQueueDB.add({
      id: `field-delete-${Date.now()}`,
      operation: 'delete',
      storeName: 'fields',
      data: { id },
      timestamp: Date.now(),
    });
  },
};

/**
 * API para operações com a fila de sincronização
 */
export const syncQueueDB = {
  getAll: async () => {
    const db = await getDB();
    return db.getAll('syncQueue');
  },

  add: async (item: any) => {
    const db = await getDB();
    return db.add('syncQueue', item);
  },

  delete: async (id: string) => {
    const db = await getDB();
    return db.delete('syncQueue', id);
  },

  clear: async () => {
    const db = await getDB();
    const tx = db.transaction('syncQueue', 'readwrite');
    await tx.objectStore('syncQueue').clear();
    await tx.done;
  },
};

/**
 * Serviço de sincronização para atualizar dados com o Firebase quando online
 */
export const syncService = {
  // Função para sincronizar dados com o backend quando ficar online
  syncWithBackend: async (): Promise<boolean> => {
    try {
      // Obter todas as operações da fila
      const operations = await syncQueueDB.getAll();
      if (operations.length === 0) return true;

      // Em produção, aqui seria feita a chamada para a API do Firebase
      console.log(`Sincronizando ${operations.length} operações com o backend`);
      
      // Simular sincronização bem-sucedida (em produção, verificar resposta da API)
      await syncQueueDB.clear();
      
      return true;
    } catch (error) {
      console.error('Erro ao sincronizar com o backend:', error);
      return false;
    }
  },

  // Função para verificar se há conexão com a internet
  isOnline: (): boolean => {
    return navigator.onLine;
  },

  // Configurar listeners para eventos online/offline
  setupNetworkListeners: (onlineCallback: () => void, offlineCallback: () => void) => {
    window.addEventListener('online', onlineCallback);
    window.addEventListener('offline', offlineCallback);

    // Retornar função para remover os listeners quando necessário
    return () => {
      window.removeEventListener('online', onlineCallback);
      window.removeEventListener('offline', offlineCallback);
    };
  },
};