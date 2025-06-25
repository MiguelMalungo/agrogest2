import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  Timestamp,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { Task, InventoryItem, Field, UserProfile } from '../types';

// Configuração do Firebase
// Nota: Em produção, estas informações viriam do .env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-key-for-development',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'agrogest-demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'agrogest-demo',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'agrogest-demo.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abcdef',
};

// Inicialização do Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const functions = getFunctions(app);

// Serviço de autenticação
export const authService = {
  // Login com e-mail e senha
  login: async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  },

  // Registro de novo usuário
  register: async (email: string, password: string, userData: Partial<UserProfile>) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      ...userData,
      email,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return userCredential;
  },

  // Logout
  logout: async () => {
    return signOut(auth);
  },

  // Obter usuário atual
  getCurrentUser: () => {
    return auth.currentUser;
  },

  // Observar mudanças no estado de autenticação
  onAuthStateChange: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  },

  // Obter perfil do usuário
  getUserProfile: async (userId: string): Promise<UserProfile | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Erro ao obter perfil do usuário:', error);
      return null;
    }
  },

  // Atualizar perfil do usuário
  updateUserProfile: async (userId: string, data: Partial<UserProfile>) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        ...data,
        updatedAt: Timestamp.now(),
      });
      return true;
    } catch (error) {
      console.error('Erro ao atualizar perfil do usuário:', error);
      return false;
    }
  },
};

// Serviço de tarefas
export const taskService = {
  // Obter todas as tarefas
  getAllTasks: async (userId: string): Promise<Task[]> => {
    try {
      const q = query(
        collection(db, 'users', userId, 'tasks'),
        orderBy('scheduledDate', 'asc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => doc.data() as Task);
    } catch (error) {
      console.error('Erro ao obter tarefas:', error);
      return [];
    }
  },

  // Obter tarefas por status
  getTasksByStatus: async (userId: string, status: string): Promise<Task[]> => {
    try {
      const q = query(
        collection(db, 'users', userId, 'tasks'),
        where('status', '==', status),
        orderBy('scheduledDate', 'asc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => doc.data() as Task);
    } catch (error) {
      console.error(`Erro ao obter tarefas com status ${status}:`, error);
      return [];
    }
  },

  // Obter tarefas por campo
  getTasksByField: async (userId: string, fieldId: string): Promise<Task[]> => {
    try {
      const q = query(
        collection(db, 'users', userId, 'tasks'),
        where('fieldId', '==', fieldId),
        orderBy('scheduledDate', 'asc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => doc.data() as Task);
    } catch (error) {
      console.error(`Erro ao obter tarefas do campo ${fieldId}:`, error);
      return [];
    }
  },

  // Adicionar nova tarefa
  addTask: async (userId: string, task: Task): Promise<boolean> => {
    try {
      await setDoc(doc(db, 'users', userId, 'tasks', task.id), task);
      return true;
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
      return false;
    }
  },

  // Atualizar tarefa existente
  updateTask: async (userId: string, taskId: string, data: Partial<Task>): Promise<boolean> => {
    try {
      await updateDoc(doc(db, 'users', userId, 'tasks', taskId), {
        ...data,
        updatedAt: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      return false;
    }
  },

  // Excluir tarefa
  deleteTask: async (userId: string, taskId: string): Promise<boolean> => {
    try {
      await deleteDoc(doc(db, 'users', userId, 'tasks', taskId));
      return true;
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      return false;
    }
  },

  // Observar mudanças nas tarefas (tempo real)
  onTasksChange: (userId: string, callback: (tasks: Task[]) => void) => {
    const q = query(
      collection(db, 'users', userId, 'tasks'),
      orderBy('scheduledDate', 'asc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const tasks = querySnapshot.docs.map((doc) => doc.data() as Task);
      callback(tasks);
    });
  },
};

// Serviço de inventário
export const inventoryService = {
  // Obter todos os itens do inventário
  getAllItems: async (userId: string): Promise<InventoryItem[]> => {
    try {
      const q = query(
        collection(db, 'users', userId, 'inventory'),
        orderBy('name', 'asc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => doc.data() as InventoryItem);
    } catch (error) {
      console.error('Erro ao obter itens de inventário:', error);
      return [];
    }
  },

  // Obter itens por tipo
  getItemsByType: async (userId: string, type: string): Promise<InventoryItem[]> => {
    try {
      const q = query(
        collection(db, 'users', userId, 'inventory'),
        where('type', '==', type),
        orderBy('name', 'asc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => doc.data() as InventoryItem);
    } catch (error) {
      console.error(`Erro ao obter itens de inventário do tipo ${type}:`, error);
      return [];
    }
  },

  // Obter itens com estoque baixo
  getLowStockItems: async (userId: string, threshold: number): Promise<InventoryItem[]> => {
    try {
      const q = query(
        collection(db, 'users', userId, 'inventory'),
        where('currentStock', '<=', threshold),
        orderBy('currentStock', 'asc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => doc.data() as InventoryItem);
    } catch (error) {
      console.error('Erro ao obter itens com estoque baixo:', error);
      return [];
    }
  },

  // Adicionar novo item ao inventário
  addItem: async (userId: string, item: InventoryItem): Promise<boolean> => {
    try {
      await setDoc(doc(db, 'users', userId, 'inventory', item.id), item);
      return true;
    } catch (error) {
      console.error('Erro ao adicionar item ao inventário:', error);
      return false;
    }
  },

  // Atualizar item existente
  updateItem: async (userId: string, itemId: string, data: Partial<InventoryItem>): Promise<boolean> => {
    try {
      await updateDoc(doc(db, 'users', userId, 'inventory', itemId), {
        ...data,
        updatedAt: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      console.error('Erro ao atualizar item do inventário:', error);
      return false;
    }
  },

  // Excluir item
  deleteItem: async (userId: string, itemId: string): Promise<boolean> => {
    try {
      await deleteDoc(doc(db, 'users', userId, 'inventory', itemId));
      return true;
    } catch (error) {
      console.error('Erro ao excluir item do inventário:', error);
      return false;
    }
  },

  // Observar mudanças no inventário (tempo real)
  onInventoryChange: (userId: string, callback: (items: InventoryItem[]) => void) => {
    const q = query(
      collection(db, 'users', userId, 'inventory'),
      orderBy('name', 'asc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const items = querySnapshot.docs.map((doc) => doc.data() as InventoryItem);
      callback(items);
    });
  },
};

// Serviço de campos
export const fieldService = {
  // Obter todos os campos
  getAllFields: async (userId: string): Promise<Field[]> => {
    try {
      const q = query(
        collection(db, 'users', userId, 'fields'),
        orderBy('name', 'asc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => doc.data() as Field);
    } catch (error) {
      console.error('Erro ao obter campos:', error);
      return [];
    }
  },

  // Obter campo específico
  getField: async (userId: string, fieldId: string): Promise<Field | null> => {
    try {
      const docRef = doc(db, 'users', userId, 'fields', fieldId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as Field;
      }
      return null;
    } catch (error) {
      console.error(`Erro ao obter campo ${fieldId}:`, error);
      return null;
    }
  },

  // Adicionar novo campo
  addField: async (userId: string, field: Field): Promise<boolean> => {
    try {
      await setDoc(doc(db, 'users', userId, 'fields', field.id), field);
      return true;
    } catch (error) {
      console.error('Erro ao adicionar campo:', error);
      return false;
    }
  },

  // Atualizar campo existente
  updateField: async (userId: string, fieldId: string, data: Partial<Field>): Promise<boolean> => {
    try {
      await updateDoc(doc(db, 'users', userId, 'fields', fieldId), {
        ...data,
        updatedAt: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      console.error('Erro ao atualizar campo:', error);
      return false;
    }
  },

  // Excluir campo
  deleteField: async (userId: string, fieldId: string): Promise<boolean> => {
    try {
      await deleteDoc(doc(db, 'users', userId, 'fields', fieldId));
      return true;
    } catch (error) {
      console.error('Erro ao excluir campo:', error);
      return false;
    }
  },
};

// Serviço para análise de imagens (simulado - em produção usaria Google Vision API)
export const imageAnalysisService = {
  analyzeImage: async (imageBase64: string) => {
    try {
      // Em produção, chamaria a Cloud Function que interage com a Vision API
      const analyzePlant = httpsCallable(functions, 'analyzePlant');
      const result = await analyzePlant({ image: imageBase64 });
      return result.data;
    } catch (error) {
      console.error('Erro ao analisar imagem:', error);
      throw error;
    }
  },
};

// Serviço para reconhecimento de voz (simulado - em produção usaria Google Speech-to-Text API)
export const speechService = {
  recognizeSpeech: async (audioBase64: string) => {
    try {
      // Em produção, chamaria a Cloud Function que interage com a Speech-to-Text API
      const recognizeSpeech = httpsCallable(functions, 'recognizeSpeech');
      const result = await recognizeSpeech({ audio: audioBase64 });
      return result.data;
    } catch (error) {
      console.error('Erro ao reconhecer fala:', error);
      throw error;
    }
  },
};