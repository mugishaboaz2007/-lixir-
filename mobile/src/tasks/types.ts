export type TaskCategory = 'Personal' | 'Work' | 'Other'

export type Task = {
  id: string
  title: string
  category: TaskCategory
  dueDate: string
  done: boolean
  createdAt: string
}
