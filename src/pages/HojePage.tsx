import React, { useState } from 'react'
import { useTaskStore } from '@/stores/useTaskStore'
import Card from '@/components/ui/Card'
import { Clock, RefreshCcw, CheckCircle, Sprout } from 'lucide-react'
import TaskCard from '@/components/ui/TaskCard'
import Button from '@/components/ui/Button'
import { Task, TaskStatus } from '@/types'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale/pt'

export const HojePage: React.FC = () => {
  const { tasks, updateTaskStatus, deleteTask } = useTaskStore()
  const [currentDate] = useState(new Date())
  
  // Filtrar tarefas de hoje
  const todayTasks = tasks.filter(task => {
    // Garantir que temos um objeto Date válido
    const taskDate = task.dataExecucao instanceof Date ? task.dataExecucao : new Date(task.dataExecucao)
    return taskDate.toDateString() === currentDate.toDateString()
  })
  
  const pendingTasks = todayTasks.filter(task => task.status === 'pendente')
  const inProgressTasks = todayTasks.filter(task => task.status === 'em_curso')
  const completedTasks = todayTasks.filter(task => task.status === 'concluida')
  
  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    updateTaskStatus(taskId, status)
  }
  
  const handleDeleteTask = (taskId: string) => {
    if (confirm('Tem certeza que deseja eliminar esta tarefa?')) {
      deleteTask(taskId)
    }
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho da página */}
      <Card variant="overlay" className="text-center">
        <h2 className="text-2xl font-bold mb-2">
          {format(currentDate, "EEEE, d 'de' MMMM", { locale: pt })}
        </h2>
        <p className="text-black">
          {todayTasks.length === 0 
            ? 'Não há tarefas programadas para hoje' 
            : `${completedTasks.length} de ${todayTasks.length} tarefas concluídas`
          }
        </p>
        
        {/* Barra de progresso */}
        {todayTasks.length > 0 && (
          <div className="mt-4">
            <div className="w-full bg-green-800/50 rounded-full h-2">
              <div 
                className="bg-green-400 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(completedTasks.length / todayTasks.length) * 100}%` 
                }}
              />
            </div>
          </div>
        )}
      </Card>

      {/* Resumo rápido */}
      <div className="grid grid-cols-3 gap-3">
        <Card variant="kpi" size="sm" className="text-center">
          <div className="text-2xl font-bold">{pendingTasks.length}</div>
          <div className="text-xs font-bold text-black">Pendentes</div>
        </Card>
        <Card variant="kpi" size="sm" className="text-center">
          <div className="text-2xl font-bold">{inProgressTasks.length}</div>
          <div className="text-xs font-bold text-black">Em Curso</div>
        </Card>
        <Card variant="kpi" size="sm" className="text-center">
          <div className="text-2xl font-bold">{completedTasks.length}</div>
          <div className="text-xs font-bold text-black">Concluídas</div>
        </Card>
      </div>

      {/* Tarefas pendentes */}
      {pendingTasks.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            <Clock className="inline w-5 h-5 mr-2 align-text-bottom" />Tarefas Pendentes
          </h3>
          <div className="space-y-3">
            {pendingTasks.map(task => (
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

      {/* Tarefas em curso */}
      {inProgressTasks.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            <RefreshCcw className="inline w-5 h-5 mr-2 align-text-bottom" />Em Curso
          </h3>
          <div className="space-y-3">
            {inProgressTasks.map(task => (
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

      {/* Tarefas concluídas */}
      {completedTasks.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            <CheckCircle className="inline w-5 h-5 mr-2 align-text-bottom" />Concluídas
          </h3>
          <div className="space-y-3">
            {completedTasks.map(task => (
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
      {todayTasks.length === 0 && (
        <Card variant="overlay" className="text-center py-12 text-black">
          <Sprout className="w-16 h-16 mb-4 mx-auto text-green-400" />
          <h3 className="text-xl font-semibold mb-2">Dia livre!</h3>
          <p className="text-green-100 mb-6">
            Não há tarefas programadas para hoje. 
            Que tal aproveitar para planear as próximas atividades?
          </p>
          <Button variant="secondary">
            Adicionar Tarefa
          </Button>
        </Card>
      )}

      {/* Botão flutuante para nova tarefa */}
      <Button
        variant="floating"
        className="fixed bottom-20 right-4"
      >
        ➕
      </Button>
    </div>
  )
}

export default HojePage
