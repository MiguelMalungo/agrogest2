import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { InventoryItem, StockMovement, ItemCategory } from '@/types'
import { v4 as uuidv4 } from 'uuid'

interface InventoryStore {
  items: InventoryItem[]
  movements: StockMovement[]
  
  // Ações para itens
  addItem: (item: Omit<InventoryItem, 'id' | 'criadoEm' | 'atualizadoEm'>) => void
  updateItem: (id: string, updates: Partial<InventoryItem>) => void
  deleteItem: (id: string) => void
  
  // Ações para movimentações
  addMovement: (movement: Omit<StockMovement, 'id'>) => void
  addStock: (itemId: string, quantidade: number, motivo: string) => void
  removeStock: (itemId: string, quantidade: number, motivo: string) => void
  
  // Consultas
  getItemsByCategory: (category: ItemCategory) => InventoryItem[]
  getLowStockItems: () => InventoryItem[]
  getItemMovements: (itemId: string) => StockMovement[]
  getTotalValue: () => number
  
  clearInventory: () => void
}

export const useInventoryStore = create<InventoryStore>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        movements: [],

        addItem: (itemData) => {
          const newItem: InventoryItem = {
            ...itemData,
            id: uuidv4(),
            criadoEm: new Date(),
            atualizadoEm: new Date()
          }
          
          set((state) => ({
            items: [...state.items, newItem]
          }))
        },

        updateItem: (id, updates) => {
          set((state) => ({
            items: state.items.map(item =>
              item.id === id
                ? { ...item, ...updates, atualizadoEm: new Date() }
                : item
            )
          }))
        },

        deleteItem: (id) => {
          set((state) => ({
            items: state.items.filter(item => item.id !== id),
            movements: state.movements.filter(movement => movement.itemId !== id)
          }))
        },

        addMovement: (movementData) => {
          const newMovement: StockMovement = {
            ...movementData,
            id: uuidv4()
          }
          
          set((state) => ({
            movements: [...state.movements, newMovement]
          }))
        },

        addStock: (itemId, quantidade, motivo) => {
          const { addMovement, updateItem } = get()
          
          // Adicionar movimento
          addMovement({
            itemId,
            tipo: 'entrada',
            quantidade,
            motivo,
            data: new Date(),
            userId: '' // Será preenchido pelo contexto do usuário
          })
          
          // Atualizar quantidade do item
          set((state) => ({
            items: state.items.map(item =>
              item.id === itemId
                ? { ...item, quantidade: item.quantidade + quantidade, atualizadoEm: new Date() }
                : item
            )
          }))
        },

        removeStock: (itemId, quantidade, motivo) => {
          const { addMovement } = get()
          
          // Verificar se há stock suficiente
          const item = get().items.find(i => i.id === itemId)
          if (!item || item.quantidade < quantidade) {
            throw new Error('Stock insuficiente')
          }
          
          // Adicionar movimento
          addMovement({
            itemId,
            tipo: 'saida',
            quantidade,
            motivo,
            data: new Date(),
            userId: '' // Será preenchido pelo contexto do usuário
          })
          
          // Atualizar quantidade do item
          set((state) => ({
            items: state.items.map(item =>
              item.id === itemId
                ? { ...item, quantidade: item.quantidade - quantidade, atualizadoEm: new Date() }
                : item
            )
          }))
        },

        getItemsByCategory: (category) => {
          const { items } = get()
          return items.filter(item => item.categoria === category)
        },

        getLowStockItems: () => {
          const { items } = get()
          return items.filter(item => item.quantidade <= item.stockMinimo)
        },

        getItemMovements: (itemId) => {
          const { movements } = get()
          return movements
            .filter(movement => movement.itemId === itemId)
            .sort((a, b) => b.data.getTime() - a.data.getTime())
        },

        getTotalValue: () => {
          const { items } = get()
          return items.reduce((total, item) => 
            total + (item.quantidade * item.precoUnitario), 0
          )
        },

        clearInventory: () => set({ items: [], movements: [] })
      }),
      {
        name: 'agrogest-inventory-storage'
      }
    ),
    {
      name: 'inventory-store'
    }
  )
)
