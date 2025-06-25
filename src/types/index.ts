// Tipos para tarefas agrícolas
export type TaskType = 'plantio' | 'rega' | 'pulverizacao' | 'colheita'
export type TaskStatus = 'pendente' | 'em_curso' | 'concluida'

export interface Task {
  id: string
  titulo: string
  descricao?: string
  tipo: TaskType
  campo: string
  dataExecucao: Date
  horaExecucao: string
  status: TaskStatus
  criadoEm: Date
  atualizadoEm: Date
  userId: string
}

// Tipos para inventário
export type ItemCategory = 'sementes' | 'fertilizantes' | 'pesticidas' | 'combustivel'

export interface InventoryItem {
  id: string
  nome: string
  categoria: ItemCategory
  quantidade: number
  unidade: string
  precoUnitario: number
  fornecedor?: string
  dataVencimento?: Date
  stockMinimo: number
  criadoEm: Date
  atualizadoEm: Date
  userId: string
}

export interface StockMovement {
  id: string
  itemId: string
  tipo: 'entrada' | 'saida'
  quantidade: number
  motivo: string
  data: Date
  userId: string
}

// Tipos para dashboard
export interface KPIData {
  areaTratada: number // hectares
  litrosAgua: number
  kgFertilizante: number
  custoDiario: number // euros
  data: Date
}

// Tipos para campos
export interface Campo {
  id: string
  nome: string
  area: number // hectares
  cultura: string
  coordenadas?: {
    latitude: number
    longitude: number
  }
  userId: string
}

// Alias para compatibilidade com os tipos de campo
export type Field = Campo

// Tipos para reconhecimento de voz e imagem
export interface VoiceCommand {
  texto: string
  confianca: number
  data: Date
}

export interface ImageDiagnosis {
  id: string
  imagemUrl: string
  diagnostico: string
  confianca: number
  recomendacoes: string[]
  campoId: string
  data: Date
  userId: string
}

// Tipos para autenticação
export interface User {
  id: string
  email: string
  nome: string
  fazenda?: string
  criadoEm: Date
}

// Perfil de usuário estendido
export interface UserProfile extends User {
  telefone?: string
  endereco?: string
  foto?: string
  updatedAt?: Date
}

// Tipos para o estado da aplicação
export interface AppState {
  user: User | null
  isOnline: boolean
  isLoading: boolean
  lastSync: Date | null
}

// Tipos para navegação
export type TabRoute = 'hoje' | 'atividades' | 'inventario' | 'dashboard' | 'definicoes' | 'campos'

export interface TabItem {
  route: TabRoute
  label: string
  icon: React.ReactNode
  path: string
}
