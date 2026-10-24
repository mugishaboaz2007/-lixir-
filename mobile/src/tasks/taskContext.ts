import { createContext } from 'react'
import { Task, TaskCategory } from './types'

export type TaskContextValue = {
  tasks: Task[]
  loading: boolean
  storageError: boolean
  retryLoad: () => void
  addTask: (title: string, category: TaskCategory, dueDate: string) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
}

export const TaskContext = createContext<TaskContextValue | null>(null)
