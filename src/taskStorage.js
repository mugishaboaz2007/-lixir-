const DATABASE_NAME = 'elixir-offline'
const DATABASE_VERSION = 1
const STORE_NAME = 'tasks'
const STORAGE_KEY = 'to-tasks'

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('This browser does not support IndexedDB.'))
      return
    }
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION)
    request.onupgradeneeded = () => {
      const database = request.result
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
    request.onblocked = () => reject(new Error('Close other Élixir tabs to finish updating local storage.'))
  })
}

export async function loadTasks() {
  const database = await openDatabase()
  try {
    const stored = await new Promise((resolve, reject) => {
      const request = database.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
    if (stored.length) return stored

    // Migrate the previous localStorage format once, without deleting it.
    const legacy = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (Array.isArray(legacy) && legacy.length) {
      await saveTasks(legacy)
      return legacy
    }
    return null
  } finally {
    database.close()
  }
}

export async function saveTasks(tasks) {
  const database = await openDatabase()
  try {
    await new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      store.clear()
      tasks.forEach((task) => store.put(task))
      transaction.oncomplete = resolve
      transaction.onerror = () => reject(transaction.error)
      transaction.onabort = () => reject(transaction.error || new Error('Could not save tasks on this device.'))
    })
  } finally {
    database.close()
  }
}
