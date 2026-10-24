import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { loadTasks, saveTasks } from './taskStorage.js'

const starterTasks = [
  { id: '1', title: 'Plan the week ahead', category: 'Personal', date: '', done: false },
  { id: '2', title: 'Review project proposal', category: 'Work', date: '', done: false },
  { id: '3', title: 'Book a dentist appointment', category: 'Personal', date: '', done: true },
]
const todayLabel = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())

function Icon({ name, size = 19 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  const paths = {
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></>,
    inbox: <><path d="M4 4h16l2 10v5H2v-5L4 4Z"/><path d="M2 14h6l2 3h4l2-3h6"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
    check: <><path d="m5 12 4 4L19 6"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    close: <><path d="m18 6-12 12M6 6l12 12"/></>,
    arrow: <><path d="M5 12h14m-7-7 7 7-7 7"/></>,
  }
  return <svg {...common}>{paths[name]}</svg>
}

function readTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem('to-tasks'))
    return Array.isArray(saved) ? saved : starterTasks
  } catch { return starterTasks }
}

function App() {
  const [tasks, setTasks] = useState(readTasks)
  const [view, setView] = useState('Today')
  const [query, setQuery] = useState('')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Personal')
  const [date, setDate] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [notice, setNotice] = useState('')
  const [online, setOnline] = useState(navigator.onLine)
  const [storageReady, setStorageReady] = useState(false)
  const [localSaveStatus, setLocalSaveStatus] = useState('loading')
  const [storageError, setStorageError] = useState('')
  const [updateReady, setUpdateReady] = useState(false)
  const searchRef = useRef(null)
  const changedBeforeLoad = useRef(false)
  const saveQueue = useRef(Promise.resolve())

  useEffect(() => {
    let active = true
    loadTasks().then((stored) => {
      if (!active) return
      if (!changedBeforeLoad.current && stored) setTasks(stored)
      setStorageReady(true)
    }).catch(() => {
      if (active) {
        setStorageReady(true)
        setStorageError('Local storage is unavailable. Your latest changes may not persist.')
      }
    })
    return () => { active = false }
  }, [])
  useEffect(() => {
    const onlineHandler = () => setOnline(true)
    const offlineHandler = () => setOnline(false)
    const updateHandler = () => setUpdateReady(true)
    window.addEventListener('online', onlineHandler)
    window.addEventListener('offline', offlineHandler)
    window.addEventListener('elixir-update-ready', updateHandler)
    return () => {
      window.removeEventListener('online', onlineHandler)
      window.removeEventListener('offline', offlineHandler)
      window.removeEventListener('elixir-update-ready', updateHandler)
    }
  }, [])
  useEffect(() => {
    if (!storageReady) return
    saveQueue.current = saveQueue.current
      .then(() => saveTasks(tasks))
      .then(() => { setStorageError(''); setLocalSaveStatus('saved') })
      .catch(() => {
        setStorageError('Could not save on this device. Keep this page open and try again.')
        setLocalSaveStatus('failed')
      })
  }, [tasks, storageReady])
  useEffect(() => {
    function handleShortcut(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])

  const visibleTasks = useMemo(() => tasks.filter((task) => {
    const matchesView = view === 'Today' ? true : view === 'Inbox' ? !task.done : view === 'Upcoming' ? !task.done && Boolean(task.date) : task.done
    return matchesView && task.title.toLowerCase().includes(query.toLowerCase())
  }), [tasks, view, query])
  const activeCount = tasks.filter((task) => !task.done).length
  const completedCount = tasks.filter((task) => task.done).length
  const viewTitle = view === 'Today' ? "Today’s Sanctuary" : view === 'Completed' ? 'Honoured' : view
  const progress = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0

  function addTask(event) {
    event.preventDefault()
    const cleanTitle = title.trim()
    if (!cleanTitle) { setNotice('Add a task name to continue.'); return }
    changedBeforeLoad.current = true
    setLocalSaveStatus('saving')
    setTasks((current) => [{ id: crypto.randomUUID(), title: cleanTitle, category, date, done: false }, ...current])
    setTitle(''); setDate(''); setShowForm(false); setNotice('Task added.')
    window.setTimeout(() => setNotice(''), 2500)
  }

  function toggleTask(id) {
    changedBeforeLoad.current = true
    setLocalSaveStatus('saving')
    setTasks((current) => current.map((task) => task.id === id ? { ...task, done: !task.done } : task))
  }

  function removeTask(id) {
    changedBeforeLoad.current = true
    setLocalSaveStatus('saving')
    setTasks((current) => current.filter((task) => task.id !== id))
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#home" aria-label="Élixir home"><img className="brand-mark" src="/elixir-mark.svg" alt=""/><span>ÉLIXIR</span></a>
        <div className="profile"><div className="avatar">✦</div><div><strong>Your sanctuary</strong><span>Private by design</span></div></div>
        <div className="nav-label">YOUR SANCTUARY</div>
        <nav className="navigation" aria-label="Task views">
          {[['Today', 'sun'], ['Inbox', 'inbox'], ['Upcoming', 'calendar'], ['Completed', 'check']].map(([label, icon]) => <button key={label} className={`nav-item ${view === label ? 'selected' : ''}`} onClick={() => setView(label)}><Icon name={icon}/><span>{label}</span><span className="nav-count">{label === 'Inbox' ? activeCount : label === 'Completed' ? completedCount : ''}</span></button>)}
        </nav>
        <div className="sidebar-bottom"><div className="focus-card"><div className="focus-icon"><Icon name="sun"/></div><strong>Discipline is the<br/>highest form of self-love.</strong><span>One intentional step at a time.</span></div><div className="sidebar-footer"><span className={`status-dot ${storageError || !online ? 'offline' : ''}`}/>{storageError || (localSaveStatus === 'loading' ? 'Opening local tasks…' : localSaveStatus === 'saving' ? 'Saving on this device…' : localSaveStatus === 'failed' ? 'Local save failed' : online ? 'Saved privately on this device' : 'Offline · saved on this device')}</div></div>
      </aside>

      <main className="main-area">
        <header className="topbar"><div className="breadcrumb"><span className="topbar-brand">ÉLIXIR</span><span>/</span><strong>{view}</strong><span className={`connection-label ${online ? '' : 'is-offline'}`}>{online ? 'Online' : 'Offline'}</span></div><label className="search-box"><Icon name="search" size={17}/><input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search rituals" aria-label="Search tasks"/><kbd>⌘ K</kbd></label></header>
        <section className="content">
          <div className="date-label"><span className="date-line"/>{todayLabel}<span className="date-line"/></div>
          <div className="heading-row"><div><h1>{viewTitle}</h1><p className="subtitle">{view === 'Today' ? '“Discipline is the highest form of self-love.”' : view === 'Inbox' ? 'Every intention, gathered in one place.' : view === 'Upcoming' ? 'A thoughtful look at what lies ahead.' : 'The moments you chose to show up.'}</p></div><button className="primary-button" disabled={!storageReady} onClick={() => setShowForm((open) => !open)}><Icon name={showForm ? 'close' : 'plus'} size={17}/>{showForm ? 'Close' : 'New ritual'}</button></div>
          <div className="progress-strip"><div className="progress-copy"><span className="progress-icon"><Icon name="sun" size={16}/></span><span><strong>Ascension status</strong><small>{completedCount} of {tasks.length} rituals honoured</small><em>{activeCount} remaining · Focus stream pristine</em></span></div><div className="progress-ring" style={{ '--progress': `${progress}%` }} aria-label={`${progress}% complete`}><span>{progress}<small>%</small></span></div></div>

          {showForm && <form className="task-form" onSubmit={addTask}><div className="form-title-wrap"><span className="form-plus"><Icon name="plus" size={17}/></span><input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Whisper a new ritual…" aria-label="Task name" maxLength="120"/></div><div className="form-options"><label><span>Collection</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option>Personal</option><option>Work</option><option>Other</option></select></label><label><span>Due date</span><input type="date" value={date} onChange={(event) => setDate(event.target.value)}/></label><button type="submit" className="submit-task">Consecrate <Icon name="arrow" size={16}/></button></div></form>}

          <div className="list-header"><span>{view === 'Completed' ? 'HONOURED RITUALS' : 'TODAY’S RITUALS'}</span><span>{visibleTasks.length} {visibleTasks.length === 1 ? 'ritual' : 'rituals'}</span></div>
          <div className="task-list">
            {visibleTasks.map((task) => <article className={`task-row ${task.done ? 'is-done' : ''}`} key={task.id}><button className="task-check" disabled={!storageReady} aria-label={task.done ? `Mark ${task.title} incomplete` : `Complete ${task.title}`} onClick={() => toggleTask(task.id)}>{task.done && <Icon name="check" size={14}/>}</button><div className="task-copy"><span className="task-title">{task.title}</span><span className="task-meta"><span className={`category-dot ${task.category.toLowerCase()}`}/>{task.category}{task.date && <><span className="meta-separator">·</span><Icon name="calendar" size={13}/>{new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(`${task.date}T00:00:00`))}</>}</span></div><button className="delete-task" disabled={!storageReady} onClick={() => removeTask(task.id)} aria-label={`Delete ${task.title}`}><Icon name="close" size={16}/></button></article>)}
            {visibleTasks.length === 0 && <div className="empty-state"><div className="empty-mark"><Icon name={query ? 'search' : view === 'Completed' ? 'check' : 'sun'} size={22}/></div><strong>{query ? 'No matching tasks' : view === 'Completed' ? 'Nothing completed yet' : 'You’re all caught up'}</strong><p>{query ? 'Try a different search.' : view === 'Completed' ? 'Finished tasks will show up here.' : 'Add a task whenever something comes to mind.'}</p>{!query && view !== 'Completed' && <button onClick={() => setShowForm(true)}><Icon name="plus" size={15}/>Add your first task</button>}</div>}
          </div>
          {notice && <div className="notice" role="status">{notice}</div>}
          {storageError && <div className="notice storage-warning" role="alert">{storageError}</div>}
          {updateReady && <div className="notice" role="status">An Élixir update is ready. <button className="update-button" onClick={() => window.elixirApplyUpdate?.()}>Update app</button></div>}
          <button className="add-another" disabled={!storageReady} onClick={() => setShowForm(true)}><span className="add-circle"><Icon name="plus" size={16}/></span>Whisper a new ritual</button>
          <footer className="main-footer"><span>Small rituals. Meaningful days.</span><span>ÉLIXIR <span className="footer-heart">✳</span></span></footer>
        </section>
      </main>
    </div>
  )
}

export default App
