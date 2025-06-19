import React, { useState, useMemo } from 'react'
import { useInventoryStore } from '@/stores/useInventoryStore'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { AlertTriangle, Search, Box, Sprout, FlaskConical, ShowerHead, Fuel } from 'lucide-react'
import { InventoryItem, ItemCategory } from '@/types'

export const InventarioPage: React.FC = () => {
  const { 
    items, 
    getLowStockItems, 
    getTotalValue, 
    getItemsByCategory,
    addStock,
    removeStock 
  } = useInventoryStore()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'todas'>('todas')
  const [showAddForm, setShowAddForm] = useState(false)
  
  // Filtrar itens
  const filteredItems = useMemo(() => {
    let filtered = items
    
    // Filtro por categoria
    if (selectedCategory !== 'todas') {
      filtered = getItemsByCategory(selectedCategory)
    }
    
    // Filtro por texto
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.fornecedor?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    return filtered.sort((a, b) => a.nome.localeCompare(b.nome))
  }, [items, searchTerm, selectedCategory, getItemsByCategory])
  
  const lowStockItems = getLowStockItems()
  const totalValue = getTotalValue()
  
  const categories = [
    { value: 'todas', label: 'Todas', icon: <Box className="w-5 h-5" /> },
    { value: 'sementes', label: 'Sementes', icon: <Sprout className="w-5 h-5" /> },
    { value: 'fertilizantes', label: 'Fertilizantes', icon: <FlaskConical className="w-5 h-5" /> },
    { value: 'pesticidas', label: 'Pesticidas', icon: <ShowerHead className="w-5 h-5" /> },
    { value: 'combustivel', label: 'Combustível', icon: <Fuel className="w-5 h-5" /> }
  ]
  
  const categoryStats = useMemo(() => {
    return categories.slice(1).map(cat => ({
      ...cat,
      count: getItemsByCategory(cat.value as ItemCategory).length,
      value: getItemsByCategory(cat.value as ItemCategory)
        .reduce((sum, item) => sum + (item.quantidade * item.precoUnitario), 0)
    }))
  }, [items, getItemsByCategory])

  const handleStockAdjustment = (item: InventoryItem, type: 'add' | 'remove') => {
    const quantidade = parseInt(prompt(`Quantidade a ${type === 'add' ? 'adicionar' : 'remover'}:`) || '0')
    if (quantidade <= 0) return
    
    const motivo = prompt('Motivo:') || `${type === 'add' ? 'Entrada' : 'Saída'} manual`
    
    try {
      if (type === 'add') {
        addStock(item.id, quantidade, motivo)
      } else {
        removeStock(item.id, quantidade, motivo)
      }
    } catch (error) {
      alert('Erro: ' + (error as Error).message)
    }
  }

  return (
    <div className="space-y-6">
      {/* Resumo do inventário */}
      <Card className="text-gray-900" variant="overlay">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-black">{items.length}</div>
            <div className="text-sm text-black">Itens</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-black">{lowStockItems.length}</div>
            <div className="text-sm text-black">Stock Baixo</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-black">€{totalValue.toFixed(0)}</div>
            <div className="text-sm text-black">Valor Total</div>
          </div>
        </div>
      </Card>

      {/* Alertas de stock baixo */}
      {lowStockItems.length > 0 && (
        <Card variant="overlay" className="border-red-500/50 text-black">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-black">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Stock Baixo ({lowStockItems.length} itens)
          </h3>
          <div className="space-y-2">
            {lowStockItems.slice(0, 5).map(item => (
              <div key={item.id} className="flex items-center justify-between bg-red-500/20 rounded-lg p-3">
                <div>
                  <div className="font-medium text-black">{item.nome}</div>
                  <div className="text-sm text-black">
                    {item.quantidade} {item.unidade} restantes
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleStockAdjustment(item, 'add')}
                >
                  Repor
                </Button>
              </div>
            ))}
            {lowStockItems.length > 5 && (
              <div className="text-sm text-red-200 text-center">
                ... e mais {lowStockItems.length - 5} itens
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Categorias */}
      <div className="grid grid-cols-2 gap-3">
        {categoryStats.map(cat => (
          <Card className="text-black" key={cat.value} variant="kpi" size="sm">
            <div className="text-center">
              <div className="text-2xl mb-1">{cat.icon}</div>
              <div className="font-semibold">{cat.count} itens</div>
              <div className="text-xs text-green-100">{cat.label}</div>
              <div className="text-sm font-medium">€{cat.value.toFixed(0)}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pesquisa */}
      <Input
        placeholder="Pesquisar itens..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        icon={<Search className="w-5 h-5 text-gray-400" />}
        variant="overlay"
      />

      {/* Filtros por categoria */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category.value}
            onClick={() => setSelectedCategory(category.value as any)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              selectedCategory === category.value
                ? 'bg-white/20 text-white'
                : 'bg-white/10 text-green-100 hover:bg-white/15'
            }`}
          >
            <span>{category.icon}</span>
            {category.label}
          </button>
        ))}
      </div>

      {/* Lista de itens */}
      <div className="space-y-3">
        {filteredItems.map(item => {
          const isLowStock = item.quantidade <= item.stockMinimo
          const dataVencimento = item.dataVencimento instanceof Date ? item.dataVencimento : (item.dataVencimento ? new Date(item.dataVencimento) : null)
          const isExpiringSoon = dataVencimento && 
            (dataVencimento.getTime() - Date.now()) / (1000 * 60 * 60 * 24) <= 30
          
          return (
            <Card
  key={item.id}
  variant="overlay"
  className={`text-black ${isLowStock ? 'border-red-500/50' : ''} ${isExpiringSoon ? 'border-yellow-500/50' : ''}`}
>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{item.nome}</h3>
                    {isLowStock && <span className="text-xs bg-red-500 text-black px-2 py-1 rounded-full">Stock Baixo</span>}
                    {isExpiringSoon && <span className="text-xs bg-yellow-500 px-2 py-1 rounded-full">A Vencer</span>}
                  </div>
                  
                  <div className="text-sm text-black space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Quantidade:</span>
                      <span className="font-medium">
                        {item.quantidade} {item.unidade}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Preço unitário:</span>
                      <span className="font-medium">€{item.precoUnitario.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Valor total:</span>
                      <span className="font-medium">
                        €{(item.quantidade * item.precoUnitario).toFixed(2)}
                      </span>
                    </div>
                    {item.fornecedor && (
                      <div className="flex items-center justify-between">
                        <span>Fornecedor:</span>
                        <span className="font-medium">{item.fornecedor}</span>
                      </div>
                    )}
                    {item.dataVencimento && (
                      <div className="flex items-center justify-between">
                        <span>Validade:</span>
                        <span className="font-medium">
                          {(item.dataVencimento instanceof Date 
                            ? item.dataVencimento 
                            : new Date(item.dataVencimento)).toLocaleDateString('pt-PT')}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleStockAdjustment(item, 'add')}
                    >
                      + Entrada
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStockAdjustment(item, 'remove')}
                      className="text-white border-white/30 hover:bg-white/10"
                    >
                      - Saída
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Mensagem quando não há itens */}
      {filteredItems.length === 0 && (
        <Card variant="overlay" className="text-center py-12 text-gray-900">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold mb-2">
            {searchTerm || selectedCategory !== 'todas' 
              ? 'Nenhum item encontrado' 
              : 'Inventário vazio'
            }
          </h3>
          <p className="text-green-100 mb-6">
            {searchTerm || selectedCategory !== 'todas'
              ? 'Experimente alterar os filtros ou termos de pesquisa'
              : 'Comece por adicionar itens ao seu inventário'
            }
          </p>
          <Button variant="secondary">
            Adicionar Item
          </Button>
        </Card>
      )}

      {/* Botão flutuante para novo item */}
      <Button
        variant="floating"
        onClick={() => setShowAddForm(true)}
      >
        ➕
      </Button>
    </div>
  )
}

export default InventarioPage
