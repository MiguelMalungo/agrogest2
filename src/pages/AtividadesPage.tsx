import React, { useState, useMemo } from 'react'
import { useTaskStore } from '@/stores/useTaskStore'
import Card from '@/components/ui/Card'
import TaskCard from '@/components/ui/TaskCard'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Task, TaskStatus, TaskType } from '@/types'
import { format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns'
import { pt } from 'date-fns/locale/pt'
import {
  List,
  Clock,
  RefreshCcw,
  CheckCircle,
  Sprout,
  Droplet,
  Sparkles,
  Wheat,
  Search,
  CalendarDays,
  FileText,
  Calendar,
  CalendarCheck,
  Book,
  BarChart2
} from 'lucide-react';

type FilterType = 'todas' | TaskStatus | TaskType

export const AtividadesPage: React.FC = () => {
  const { tasks, updateTaskStatus, deleteTask } = useTaskStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<FilterType>('todas')
  const [showNewTaskForm, setShowNewTaskForm] = useState(false)
  
  // Filtros
  const filteredTasks = useMemo(() => {
    let filtered = tasks
    
    // Filtro por texto
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.campo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Filtro por tipo/status
    if (filter !== 'todas') {
      filtered = filtered.filter(task => 
        task.status === filter || task.tipo === filter
      )
    }
    
    // Ordenar por data e hora
    return filtered.sort((a, b) => {
      const aDate = a.dataExecucao instanceof Date ? a.dataExecucao : new Date(a.dataExecucao)
      const bDate = b.dataExecucao instanceof Date ? b.dataExecucao : new Date(b.dataExecucao)
      const dateA = new Date(`${aDate.toDateString()} ${a.horaExecucao}`)
      const dateB = new Date(`${bDate.toDateString()} ${b.horaExecucao}`)
      return dateA.getTime() - dateB.getTime()
    })
  }, [tasks, searchTerm, filter])
  
  // Agrupar tarefas
  const taskGroups = useMemo(() => {
    const today = new Date()
    const weekStart = startOfWeek(today, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 })
    
    return {
      today: filteredTasks.filter(task => {
        const taskDate = task.dataExecucao instanceof Date ? task.dataExecucao : new Date(task.dataExecucao)
        return taskDate.toDateString() === today.toDateString()
      }),
      thisWeek: filteredTasks.filter(task => {
        const taskDate = task.dataExecucao instanceof Date ? task.dataExecucao : new Date(task.dataExecucao)
        return isWithinInterval(taskDate, { start: weekStart, end: weekEnd }) &&
          taskDate.toDateString() !== today.toDateString()
      }),
      future: filteredTasks.filter(task => {
        const taskDate = task.dataExecucao instanceof Date ? task.dataExecucao : new Date(task.dataExecucao)
        return taskDate > weekEnd
      }),
      past: filteredTasks.filter(task => {
        const taskDate = task.dataExecucao instanceof Date ? task.dataExecucao : new Date(task.dataExecucao)
        return taskDate < weekStart
      })
    }
  }, [filteredTasks])
  
  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    updateTaskStatus(taskId, status)
  }
  
  const handleDeleteTask = (taskId: string) => {
    if (confirm('Tem certeza que deseja eliminar esta tarefa?')) {
      deleteTask(taskId)
    }
  }

  const filterOptions = [
    { value: 'todas', label: 'Todas', icon: <List className="w-5 h-5" /> },
    { value: 'pendente', label: 'Pendentes', icon: <Clock className="w-5 h-5" /> },
    { value: 'em_curso', label: 'Em Curso', icon: <RefreshCcw className="w-5 h-5" /> },
    { value: 'concluida', label: 'Concluídas', icon: <CheckCircle className="w-5 h-5" /> },
    { value: 'plantio', label: 'Plantio', icon: <Sprout className="w-5 h-5" /> },
    { value: 'rega', label: 'Rega', icon: <Droplet className="w-5 h-5" /> },
    { value: 'pulverizacao', label: 'Pulverização', icon: <Sparkles className="w-5 h-5" /> },
    { value: 'colheita', label: 'Colheita', icon: <Wheat className="w-5 h-5" /> }
  ]

  return (
    <div className="space-y-6">
      {/* Cabeçalho com estatísticas */}
      <Card variant="overlay">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{tasks.length}</div>
            <div className="text-sm text-green-100">Total</div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {tasks.filter(t => t.status === 'pendente').length}
            </div>
            <div className="text-sm text-green-100">Pendentes</div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {tasks.filter(t => t.status === 'concluida').length}
            </div>
            <div className="text-sm text-green-100">Concluídas</div>
          </div>
        </div>
      </Card>

      {/* Pesquisa */}
      <Input
        placeholder="Pesquisar tarefas..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        icon={<Search className="w-5 h-5 text-gray-400" />}
        variant="overlay"
      />

      {/* Filtros */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {filterOptions.map(option => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value as FilterType)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              filter === option.value
                ? 'bg-white/20 text-white'
                : 'bg-white/10 text-green-100'
            }`}
          >
            {option.icon}
            {option.label}
          </button>
        ))}
      </div>

      {/* Tarefas de hoje */}
      {taskGroups.today.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            Hoje - {format(new Date(), 'd MMMM', { locale: pt })}
          </h3>
          <div className="space-y-3">
            {taskGroups.today.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tarefas desta semana */}
      {taskGroups.thisWeek.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Esta Semana
          </h3>
          <div className="space-y-3">
            {taskGroups.thisWeek.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tarefas futuras */}
      {taskGroups.future.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5" />
            Próximas Tarefas
          </h3>
          <div className="space-y-3">
            {taskGroups.future.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tarefas passadas */}
      {taskGroups.past.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Book className="w-5 h-5" />
            Tarefas Anteriores
          </h3>
          <div className="space-y-3">
            {taskGroups.past.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        </div>
      )}

      {/* Mensagem quando não há tarefas */}
      {filteredTasks.length === 0 && (
        <Card variant="overlay" className="text-center py-12 text-black">
          <FileText className="w-16 h-16 mb-4 mx-auto text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">
            {searchTerm || filter !== 'todas' 
              ? 'Nenhuma tarefa encontrada' 
              : 'Nenhuma tarefa criada'
            }
          </h3>
          <p className="text-green-100 mb-6">
            {searchTerm || filter !== 'todas'
              ? 'Experimente alterar os filtros ou termos de pesquisa'
              : 'Comece por criar a sua primeira tarefa agrícola'
            }
          </p>
          <Button variant="secondary">
            Nova Tarefa
          </Button>
        </Card>
      )}

      {/* Botão flutuante para nova tarefa */}
      <Button
        variant="floating"
        onClick={() => setShowNewTaskForm(true)}
      >
        ➕
      </Button>
    </div>
  )
}

export default AtividadesPage
