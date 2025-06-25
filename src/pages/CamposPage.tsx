import { Search, Filter, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import { useFieldStore } from '@/stores/useFieldStore'
import { useEffect, useState } from 'react'
import { Field, FieldType, SoilType } from '@/types/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select' // Note: using lowercase 'select' to match file system
import { VoiceButton } from '@/components/ui/VoiceButton'

export default function CamposPage() {
  const navigate = useNavigate()
  const { getActiveFields, getFieldsByStatus, searchFields, fields: allFields } = useFieldStore()
  const [fields, setFields] = useState<Field[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    status: 'all', // all, active, inactive
    tipo: 'all',
    tipoSolo: 'all',
  })
  const [showFilters, setShowFilters] = useState(false)
  const [filteredFields, setFilteredFields] = useState<Field[]>([])
  
  // Se não houver campos, redirecionar para o formulário de novo campo
  useEffect(() => {
    if (allFields.length === 0) {
      navigate('/campos/novo', { replace: true })
    } else {
      // Atualizar a lista de campos quando houver alterações
      setFields(getActiveFields())
    }
  }, [allFields.length, navigate, getActiveFields])

  useEffect(() => {
    const applyFilters = () => {
      let result = []
      
      // Obter campos com base no status
      if (filters.status === 'active') {
        result = getActiveFields()
      } else if (filters.status === 'inactive') {
        result = getFieldsByStatus(false)
      } else {
        // Se for 'all', pega todos os campos
        result = [...getActiveFields(), ...getFieldsByStatus(false)]
      }
      
      // Aplicar filtro de tipo
      if (filters.tipo !== 'all') {
        result = result.filter(field => field.tipo === filters.tipo)
      }
      
      // Aplicar filtro de tipo de solo
      if (filters.tipoSolo !== 'all') {
        result = result.filter(field => field.tipoSolo === filters.tipoSolo)
      }
      
      // Aplicar busca
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        result = result.filter(field => 
          field.nome.toLowerCase().includes(term) || 
          field.descricao?.toLowerCase().includes(term) ||
          field.observacoes?.toLowerCase().includes(term)
        )
      }
      
      setFilteredFields(result)
    }
    
    applyFilters()
  }, [filters, searchTerm, getActiveFields, getFieldsByStatus])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      status: 'all',
      tipo: 'all',
      tipoSolo: 'all',
    })
    setSearchTerm('')
  }

  const hasActiveFilters = filters.status !== 'all' || 
                         filters.tipo !== 'all' || 
                         filters.tipoSolo !== 'all' || 
                         searchTerm !== ''

  return (
    <div className="container mx-auto p-4 relative min-h-screen flex flex-col">
      {/* Header with search and filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Gestão de Campos</h1>
        
        {fields.length > 0 && (
          <div className="flex space-x-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar campos..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            
            <Button
              variant={showFilters ? 'secondary' : 'outline'}
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Filters section */}
      {showFilters && fields.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6 animate-in fade-in-0 zoom-in-95">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Filtros</h2>
            <Button variant="ghost" size="sm" onClick={clearFilters} disabled={!hasActiveFilters}>
              <X className="h-4 w-4 mr-1" />
              Limpar
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <Select 
                value={filters.status} 
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Campo</label>
              <Select 
                value={filters.tipo} 
                onValueChange={(value) => handleFilterChange('tipo', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="campo_aberto">Campo Aberto</SelectItem>
                  <SelectItem value="estufa">Estufa</SelectItem>
                  <SelectItem value="vinha">Vinha</SelectItem>
                  <SelectItem value="olival">Olival</SelectItem>
                  <SelectItem value="pomar">Pomar</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Solo</label>
              <Select 
                value={filters.tipoSolo} 
                onValueChange={(value) => handleFilterChange('tipoSolo', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="arenoso">Arenoso</SelectItem>
                  <SelectItem value="argiloso">Argiloso</SelectItem>
                  <SelectItem value="humoso">Humoso</SelectItem>
                  <SelectItem value="misto">Misto</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Main content area - grows to fill available space */}
      <div className="flex-grow">
        {fields.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredFields.map((field) => (
              <Card
                key={field.id}
                className="cursor-pointer hover:shadow-xl transition-shadow text-black"
                onClick={() => navigate(`/campos/${field.id}`)}
              >
                <div className="flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-black">{field.nome}</h3>
                    {!field.ativo && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        Inativo
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-black mb-2 line-clamp-2">
                      {field.descricao || 'Nenhuma descrição fornecida'}
                    </p>
                    <div className="text-sm space-y-1">
                      <p className="flex items-center">
                        <span className="font-medium w-16 inline-block text-black">Tipo:</span>
                        <span className="bg-blue-50/95 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {formatFieldType(field.tipo)}
                        </span>
                      </p>
                      <p className="text-black"><span className="font-medium w-16 inline-block">Área:</span> {field.area} ha</p>
                      <p>
                        <span className="font-medium w-16 inline-block text-black">Solo:</span>
                        <span className="bg-green-50/95 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {formatSoilType(field.tipoSolo)}
                        </span>
                      </p>
                      {Number(field.capacidadeIrrigacao) > 0 && (
                        <p className="text-black"><span className="font-medium w-16 inline-block">Irrigação:</span> {field.capacidadeIrrigacao} m³/h</p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-16">
            <div className="text-center max-w-md mx-auto">
              <div className="bg-gray-100/95 rounded-full p-6 inline-block mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                  <path d="M3 3v18h18"/>
                  <path d="M7 13v-2a2 2 0 0 1 4 0v2"/>
                  <path d="M14 13V8a2 2 0 0 1 4 0v5"/>
                  <path d="M10 13v4"/>
                  <path d="M17 13v4"/>
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2">Nenhum campo cadastrado</h2>
              <p className="text-gray-500 mb-8">
                {hasActiveFilters 
                  ? 'Nenhum campo encontrado com os filtros atuais.'
                  : 'Adicione seu primeiro campo para começar a gerenciar suas áreas de cultivo.'}
              </p>
              
              {hasActiveFilters && (
                <Button 
                  onClick={clearFilters}
                  variant="outline" 
                  className="mb-4 w-full"
                >
                  <X className="mr-2 h-4 w-4" />
                  Limpar filtros
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Fixed bottom button for creating a new field */}
      <div className="fixed bottom-20 left-4 z-50 flex items-center">
        <Button
          onClick={() => navigate('/campos/novo')}
          className="rounded-full w-14 h-14 shadow-md flex items-center justify-center bg-[#F5A926] hover:bg-white hover:text-black border-2 border-[#F5A926]"
          aria-label="Criar um Campo"
        >
          <div className="flex items-center justify-center w-full h-full">
            <span className="text-2xl font-normal text-black leading-none mb-0.5">+</span>
          </div>
        </Button>
        <span className="ml-3 text-white font-medium">Criar Campo</span>
      </div>
      
      {/* Add padding at the bottom to prevent content from being hidden behind the fixed button */}
      <div className="pb-20"></div>
    </div>
  )
}

function formatFieldType(type: string): string {
  const types: Record<string, string> = {
    'campo_aberto': 'Campo Aberto',
    'estufa': 'Estufa',
    'vinha': 'Vinha',
    'olival': 'Olival',
    'pomar': 'Pomar',
    'outro': 'Outro'
  }
  return types[type] || type
}

function formatSoilType(type: string): string {
  const types: Record<string, string> = {
    'arenoso': 'Arenoso',
    'argiloso': 'Argiloso',
    'humoso': 'Humoso',
    'misto': 'Misto',
    'outro': 'Outro'
  }
  return types[type] || type
}
