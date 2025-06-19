import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Task, TaskType, TaskStatus } from '@/types'
import { v4 as uuidv4 } from 'uuid'

interface TaskStore {
  tasks: Task[]
  
  // Ações
  addTask: (task: Omit<Task, 'id' | 'criadoEm' | 'atualizadoEm'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  updateTaskStatus: (id: string, status: TaskStatus) => void
  getTasksByDate: (date: Date) => Task[]
  getTasksByStatus: (status: TaskStatus) => Task[]
  getTasksByType: (type: TaskType) => Task[]
  getTodayTasks: () => Task[]
  clearTasks: () => void
}

export const useTaskStore = create<TaskStore>()(
  devtools(
    persist(
      (set, get) => ({
        tasks: [],

        addTask: (taskData) => {
          const newTask: Task = {
            ...taskData,
            id: uuidv4(),
            criadoEm: new Date(),
            atualizadoEm: new Date()
          }
          
          set((state) => ({
            tasks: [...state.tasks, newTask]
          }))
        },

        updateTask: (id, updates) => {
          set((state) => ({
            tasks: state.tasks.map(task =>
              task.id === id
                ? { ...task, ...updates, atualizadoEm: new Date() }
                : task
            )
          }))
        },

        deleteTask: (id) => {
          set((state) => ({
            tasks: state.tasks.filter(task => task.id !== id)
          }))
        },

        updateTaskStatus: (id, status) => {
          set((state) => ({
            tasks: state.tasks.map(task =>
              task.id === id
                ? { ...task, status, atualizadoEm: new Date() }
                : task
            )
          }))
        },

        getTasksByDate: (date) => {
          const { tasks } = get()
          const targetDate = date.toDateString()
          return tasks.filter(task => 
            task.dataExecucao.toDateString() === targetDate
          )
        },

        getTasksByStatus: (status) => {
          const { tasks } = get()
          return tasks.filter(task => task.status === status)
        },

        getTasksByType: (type) => {
          const { tasks } = get()
          return tasks.filter(task => task.tipo === type)
        },

        getTodayTasks: () => {
          const { getTasksByDate } = get()
          return getTasksByDate(new Date())
        },

        clearTasks: () => set({ tasks: [] })
      }),
      {
        name: 'agrogest-tasks-storage'
      }
    ),
    {
      name: 'task-store'
    }
  )
)
