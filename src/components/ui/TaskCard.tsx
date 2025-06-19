import React from 'react'
import { cn } from '@/lib/utils'
import { Task, TaskStatus } from '@/types'
import Card from './Card'
import Button from './Button'
import { Sprout, Droplet, Sparkles, Wheat, Calendar, Clock, Edit, Trash } from 'lucide-react'

interface TaskCardProps {
  task: Task
  onStatusChange?: (taskId: string, status: TaskStatus) => void
  onEdit?: (task: Task) => void
  onDelete?: (taskId: string) => void
  className?: string
}

const TaskTypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'plantio':
      return <Sprout className="h-6 w-6 text-green-600" />
    case 'rega':
      return <Droplet className="h-6 w-6 text-blue-500" />
    case 'pulverizacao':
      return <Sparkles className="h-6 w-6 text-purple-500" />
    case 'colheita':
      return <Wheat className="h-6 w-6 text-yellow-600" />
    default:
      return <Sprout className="h-6 w-6 text-green-600" />
  }
}

const taskTypeLabels = {
  plantio: 'Plantio',
  rega: 'Rega',
  pulverizacao: 'Pulverização',
  colheita: 'Colheita'
}

const statusColors = {
  pendente: 'bg-[#F5A926]',
  em_curso: 'bg-agrogest-light',
  concluida: 'bg-green-600'
}

const statusLabels = {
  pendente: 'Pendente',
  em_curso: 'Em Curso',
  concluida: 'Concluída'
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onStatusChange,
  onEdit,
  onDelete,
  className
}) => {
  const isCompleted = task.status === 'concluida'
  const isPending = task.status === 'pendente'
  
  const handleStatusToggle = () => {
    if (!onStatusChange) return
    
    if (isPending) {
      onStatusChange(task.id, 'em_curso')
    } else if (task.status === 'em_curso') {
      onStatusChange(task.id, 'concluida')
    }
  }

  return (
    <Card 
      variant="overlay" 
      className={cn(
        'transition-all duration-200 ',
        isCompleted && 'opacity-75',
        className
      )}
    >
      <div className="flex items-start gap-3">
        {/* Ícone do tipo de tarefa */}
        <div className="mt-1">
          <TaskTypeIcon type={task.tipo} />
        </div>
        
        {/* Conteúdo principal */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <h3 className={cn(
                'font-semibold text-lg text-black',
                isCompleted && 'line-through opacity-75'
              )}>
                {task.titulo}
              </h3>
              <p className="text-sm text-black">
                {taskTypeLabels[task.tipo]} - {task.campo}
              </p>
            </div>
            
            {/* Status badge */}
            <div className={cn(
              'px-2 py-1 rounded-full text-xs font-medium',
              statusColors[task.status],
              task.status === 'pendente' || task.status === 'em_curso' ? 'text-black' : 'text-white'
            )}>
              {statusLabels[task.status]}
            </div>
          </div>
          
          {/* Descrição */}
          {task.descricao && (
            <p className="text-sm text-black mb-3 opacity-90">
              {task.descricao}
            </p>
          )}
          
          {/* Data e hora */}
          <div className="flex items-center gap-4 text-sm text-black mb-3">
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {typeof task.dataExecucao === 'string' ? new Date(task.dataExecucao).toLocaleDateString('pt-PT') : task.dataExecucao.toLocaleDateString('pt-PT')}</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {task.horaExecucao}</span>
          </div>
          
          {/* Ações */}
          <div className="flex items-center gap-2">
            {!isCompleted && (
              <Button
                size="sm"
                variant="secondary"
                onClick={handleStatusToggle}
              >
                {isPending ? 'Iniciar' : 'Concluir'}
              </Button>
            )}
            
            {onEdit && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(task)}
                className="text-black hover:bg-gray-100 flex items-center gap-1"
              >
                <Edit className="h-4 w-4" /> Editar
              </Button>
            )}
            
            {onDelete && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(task.id)}
                className="text-red-500 hover:bg-red-50 hover:text-red-600 flex items-center gap-1"
              >
                <Trash className="h-4 w-4" /> Eliminar
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default TaskCard
