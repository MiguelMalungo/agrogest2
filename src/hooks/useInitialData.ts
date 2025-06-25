import { useEffect } from 'react'
import { useTaskStore } from '@/stores/useTaskStore'
import { useInventoryStore } from '@/stores/useInventoryStore'
import { useAppStore } from '@/stores/useAppStore'
import { useFieldStore } from '@/stores/useFieldStore'
import { CreateFieldDTO } from '@/types/field'

export const useInitialData = () => {
  const { tasks, addTask } = useTaskStore()
  const { items, addItem } = useInventoryStore()
  const { user, setUser } = useAppStore()
  const { fields, addField } = useFieldStore()

  useEffect(() => {
    // Configurar utilizador exemplo se não existir
    if (!user) {
      setUser({
        id: 'user-1',
        email: 'agricultor@agrogest.pt',
        nome: 'João Silva',
        fazenda: 'Quinta do Vale Verde',
        criadoEm: new Date()
      })
    }

    // Adicionar tarefas exemplo se não existirem
    if (tasks.length === 0) {
      const sampleTasks = [
        {
          titulo: 'Rega do Campo A',
          descricao: 'Rega matinal do campo de milho',
          tipo: 'rega' as const,
          campo: 'Campo A - Milho',
          dataExecucao: new Date(),
          horaExecucao: '07:00',
          status: 'pendente' as const,
          userId: 'user-1'
        },
        {
          titulo: 'Aplicação de Fertilizante',
          descricao: 'Aplicar fertilizante NPK no campo de tomate',
          tipo: 'pulverizacao' as const,
          campo: 'Campo B - Tomate',
          dataExecucao: new Date(Date.now() + 24 * 60 * 60 * 1000), // amanhã
          horaExecucao: '08:30',
          status: 'pendente' as const,
          userId: 'user-1'
        },
        {
          titulo: 'Plantio de Alface',
          descricao: 'Plantio de mudas de alface na estufa 1',
          tipo: 'plantio' as const,
          campo: 'Estufa 1',
          dataExecucao: new Date(Date.now() - 24 * 60 * 60 * 1000), // ontem
          horaExecucao: '09:00',
          status: 'concluida' as const,
          userId: 'user-1'
        },
        {
          titulo: 'Colheita de Cenouras',
          descricao: 'Colheita das cenouras do campo C',
          tipo: 'colheita' as const,
          campo: 'Campo C - Cenouras',
          dataExecucao: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // próxima semana
          horaExecucao: '06:00',
          status: 'pendente' as const,
          userId: 'user-1'
        },
        {
          titulo: 'Rega da Estufa 2',
          descricao: 'Rega do sistema de gotejamento',
          tipo: 'rega' as const,
          campo: 'Estufa 2',
          dataExecucao: new Date(),
          horaExecucao: '18:00',
          status: 'em_curso' as const,
          userId: 'user-1'
        }
      ]

      sampleTasks.forEach(task => addTask(task))
    }

    // Adicionar itens de inventário exemplo se não existirem
    if (items.length === 0) {
      const sampleItems = [
        {
          nome: 'Sementes de Milho',
          categoria: 'sementes' as const,
          quantidade: 25,
          unidade: 'kg',
          precoUnitario: 4.50,
          fornecedor: 'Agrosementes Lda',
          stockMinimo: 10,
          userId: 'user-1'
        },
        {
          nome: 'Fertilizante NPK 20-10-10',
          categoria: 'fertilizantes' as const,
          quantidade: 8,
          unidade: 'sacos 25kg',
          precoUnitario: 28.00,
          fornecedor: 'Fertilizantes do Norte',
          stockMinimo: 5,
          userId: 'user-1'
        },
        {
          nome: 'Pesticida Orgânico',
          categoria: 'pesticidas' as const,
          quantidade: 3,
          unidade: 'litros',
          precoUnitario: 35.00,
          fornecedor: 'EcoAgri',
          dataVencimento: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 dias
          stockMinimo: 2,
          userId: 'user-1'
        },
        {
          nome: 'Gasóleo Agrícola',
          categoria: 'combustivel' as const,
          quantidade: 150,
          unidade: 'litros',
          precoUnitario: 0.85,
          fornecedor: 'Posto Combustível Rural',
          stockMinimo: 50,
          userId: 'user-1'
        },
        {
          nome: 'Sementes de Tomate',
          categoria: 'sementes' as const,
          quantidade: 2,
          unidade: 'kg',
          precoUnitario: 12.00,
          fornecedor: 'Sementes Premium',
          stockMinimo: 5,
          userId: 'user-1'
        },
        {
          nome: 'Adubo Composto',
          categoria: 'fertilizantes' as const,
          quantidade: 12,
          unidade: 'sacos 50kg',
          precoUnitario: 18.50,
          fornecedor: 'Adubos Naturais',
          stockMinimo: 8,
          userId: 'user-1'
        }
      ]

      sampleItems.forEach(item => addItem(item))
    }
  
    // Adicionar campos de exemplo se não existirem
    if (fields.length === 0) {
      const sampleFields: CreateFieldDTO[] = [
        {
          nome: 'Campo A',
          descricao: 'Campo de milho',
          tipo: 'campo_aberto',
          area: 2.5,
          tipoSolo: 'argiloso',
          capacidadeIrrigacao: 'Gotejamento',
          coordenadas: '38.7071, -9.1355',
          observacoes: 'Solo fértil com boa drenagem',
          userId: 'user-1',
          ativo: true
        },
        {
          nome: 'Estufa 1',
          descricao: 'Estufa de tomate',
          tipo: 'estufa',
          area: 0.2,
          tipoSolo: 'humoso',
          capacidadeIrrigacao: 'Aspersão',
          observacoes: 'Controle de temperatura e humidade',
          userId: 'user-1',
          ativo: true
        },
        {
          nome: 'Campo B',
          descricao: 'Vinha antiga',
          tipo: 'vinha',
          area: 1.8,
          tipoSolo: 'arenoso',
          capacidadeIrrigacao: 'Gotejamento',
          coordenadas: '38.7080, -9.1360',
          observacoes: 'Vinhas com mais de 20 anos',
          userId: 'user-1',
          ativo: true
        }
      ]

      sampleFields.forEach(field => addField(field))
    }
  }, [tasks.length, items.length, fields.length, user, addTask, addItem, addField, setUser])
}
