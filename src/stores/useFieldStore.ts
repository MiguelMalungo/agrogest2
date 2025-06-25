import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import { Field, CreateFieldDTO, UpdateFieldDTO } from '@/types/field'

interface FieldStore {
  fields: Field[]
  
  // Ações
  addField: (field: Omit<Field, 'id' | 'dataCriacao' | 'dataAtualizacao' | 'ativo'>) => void
  updateField: (id: string, updates: Partial<Omit<Field, 'id' | 'dataCriacao' | 'dataAtualizacao' | 'ativo'>>) => void
  deleteField: (id: string) => void
  getField: (id: string) => Field | undefined
  getActiveFields: () => Field[]
  getFieldsByStatus: (active: boolean) => Field[]
  toggleFieldStatus: (id: string) => void
  searchFields: (term: string, fields?: Field[]) => Field[]
  clearFields: () => void
}

export const useFieldStore = create<FieldStore>()(
  persist(
    (set, get) => ({
      fields: [],
      
      addField: (fieldData: Omit<Field, 'id' | 'dataCriacao' | 'dataAtualizacao' | 'ativo'>) => {
        const newField: Field = {
          ...fieldData,
          id: uuidv4(),
          dataCriacao: new Date().toISOString(),
          dataAtualizacao: new Date().toISOString(),
          ativo: true,
          userId: 'current-user-id' // TODO: Substituir pelo ID do usuário logado
        }
        
        set((state) => ({
          fields: [...state.fields, newField]
        }))
      },
      
      updateField: (id: string, updates: Partial<Omit<Field, 'id' | 'dataCriacao' | 'dataAtualizacao' | 'ativo'>>) => {
        set((state) => ({
          fields: state.fields.map(field =>
            field.id === id
              ? { 
                  ...field, 
                  ...updates, 
                  dataAtualizacao: new Date().toISOString(),
                  coordenadas: updates.coordenadas || field.coordenadas
                }
              : field
          )
        }))
      },
      
      deleteField: (id: string) => {
        set((state) => ({
          fields: state.fields.filter(field => field.id !== id)
        }))
      },
      
      getField: (id: string) => {
        return get().fields.find(field => field.id === id)
      },
      
      getActiveFields: () => {
        return get().fields.filter(field => field.ativo)
      },
      
      getFieldsByStatus: (active: boolean) => {
        return get().fields.filter(field => field.ativo === active)
      },
      
      toggleFieldStatus: (id: string) => {
        const field = get().getField(id);
        if (field) {
          get().updateField(id, { ativo: !field.ativo });
        }
      },
      
      searchFields: (term: string, fields = get().fields) => {
        if (!term.trim()) return fields;
        
        const searchTerm = term.toLowerCase();
        return fields.filter(field => 
          field.nome.toLowerCase().includes(searchTerm) ||
          field.descricao?.toLowerCase().includes(searchTerm) ||
          field.observacoes?.toLowerCase().includes(searchTerm) ||
          field.tipo.toLowerCase().includes(searchTerm) ||
          field.tipoSolo.toLowerCase().includes(searchTerm)
        );
      },
      
      clearFields: () => set({ fields: [] })
    }),
    {
      name: 'agrogest-fields-storage'
    }
  )
)
