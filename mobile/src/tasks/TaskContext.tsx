import AsyncStorage from '@react-native-async-storage/async-storage'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import type { Task } from './types'
import type { TaskCategory } from './types'
import { TaskContext } from './taskContext'

const STORAGE_KEY = 'to.tasks.v1'

export function TaskProvider({ children }: PropsWithChildren) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [storageError, setStorageError] = useState(false)
  const [loadVersion, setLoadVersion] = useState(0)

  useEffect(() => {
    let alive = true
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (!alive) return
      if (stored) {
        const parsed: unknown = JSON.parse(stored)
        if (!Array.isArray(parsed)) throw new Error('Invalid task data')
        setTasks(parsed as Task[])
      }
      setStorageError(false)
      setLoading(false)
    }).catch(() => {
      if (alive) { setStorageError(true); setLoading(false) }
    })
    return () => { alive = false }
  }, [loadVersion])

  useEffect(() => {
    if (loading || storageError) return
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)).catch(() => setStorageError(true))
  }, [tasks, loading, storageError])

  const addTask = useCallback((title: string, category: TaskCategory, dueDate: string) => {
    const task: Task = { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, title: title.trim(), category, dueDate, done: false, createdAt: new Date().toISOString() }
    setTasks((current) => [task, ...current])
  }, [])
  const toggleTask = useCallback((id: string) => setTasks((current) => current.map((task) => task.id === id ? { ...task, done: !task.done } : task)), [])
  const deleteTask = useCallback((id: string) => setTasks((current) => current.filter((task) => task.id !== id)), [])
  const retryLoad = useCallback(() => {
    setLoading(true)
    setStorageError(false)
    setLoadVersion((version) => version + 1)
  }, [])

  const value = useMemo(() => ({ tasks, loading, storageError, retryLoad, addTask, toggleTask, deleteTask }), [tasks, loading, storageError, retryLoad, addTask, toggleTask, deleteTask])
  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}
