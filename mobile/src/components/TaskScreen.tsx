import { useMemo, useState } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTasks } from '../tasks/useTasks'
import { Task } from '../tasks/types'

type ScreenView = 'Today' | 'Inbox' | 'Upcoming' | 'Completed'

const colors = { ink: '#f5f5f7', muted: '#8e8e93', accent: '#e8def8', border: 'rgba(226,224,235,0.12)', paper: '#181110', card: '#221715', raised: '#2a1e1a' }

function formattedDate() {
  return new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())
}

function TaskRow({ task, onToggle, onDelete }: { task: Task; onToggle: () => void; onDelete: () => void }) {
  const tint = task.category === 'Work' ? '#cbb6ee' : task.category === 'Other' ? '#d4af7c' : '#a59bb0'
  return (
    <View style={styles.taskRow}>
      <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: task.done }} accessibilityLabel={`${task.done ? 'Mark incomplete' : 'Complete'} ${task.title}`} onPress={onToggle} style={({ pressed }) => [styles.check, task.done && styles.checked, pressed && styles.pressed]}>
        {task.done && <Text style={styles.checkMark}>✓</Text>}
      </Pressable>
      <Pressable onPress={onToggle} style={styles.taskBody}>
        <Text style={[styles.taskTitle, task.done && styles.doneTitle]}>{task.title}</Text>
        <View style={styles.metaRow}><View style={[styles.categoryDot, { backgroundColor: tint }]} /><Text style={styles.metaText}>{task.category}</Text>{task.dueDate ? <><Text style={styles.metaSeparator}>·</Text><Text style={styles.metaText}>{new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(`${task.dueDate}T00:00:00`))}</Text></> : null}</View>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel={`Delete ${task.title}`} hitSlop={10} onPress={() => Alert.alert('Delete this task?', task.title, [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: onDelete }])} style={styles.deleteButton}><Text style={styles.deleteText}>×</Text></Pressable>
    </View>
  )
}

export default function TaskScreen({ view }: { view: ScreenView }) {
  const { tasks, loading, storageError, retryLoad, toggleTask, deleteTask } = useTasks()
  const [query, setQuery] = useState('')
  const visibleTasks = useMemo(() => tasks.filter((task) => {
    const viewMatches = view === 'Completed' ? task.done : view === 'Upcoming' ? !task.done && Boolean(task.dueDate) : view === 'Today' ? !task.done : true
    return viewMatches && task.title.toLocaleLowerCase().includes(query.toLocaleLowerCase())
  }), [tasks, view, query])
  const completed = tasks.filter((task) => task.done).length
  const title = view === 'Today' ? 'Today’s Sanctuary' : view === 'Completed' ? 'Honoured' : view === 'Inbox' ? 'All Rituals' : view
  const subtitle = view === 'Today' ? 'Discipline is the highest form of self-love.' : view === 'Inbox' ? 'Every intention, gathered in one place.' : view === 'Upcoming' ? 'A thoughtful look at what lies ahead.' : 'The moments you chose to show up.'

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
        <View style={styles.topline}><View><Text style={styles.brandLabel}>✦  ÉLIXIR</Text><Text style={styles.dateText}>{formattedDate().toUpperCase()}</Text></View><View style={styles.avatar}><Text style={styles.avatarText}>✦</Text></View></View>
        <Text style={styles.eyebrow}>DAILY AGENDAS</Text>
        <View style={styles.headingRow}><View style={styles.headingCopy}><Text style={styles.heading}>{title}</Text><Text style={styles.subtitle}>{subtitle}</Text></View><Text style={styles.countBadge}>{tasks.filter((task) => !task.done).length}</Text></View>
        <View style={styles.progressCard}><View style={styles.progressCopy}><View style={styles.progressText}><Text style={styles.progressEyebrow}>ASCENSION STATUS</Text><Text style={styles.progressTitle}>{tasks.length ? Math.round((completed / tasks.length) * 100) : 0}% <Text style={styles.manifested}>Manifested</Text></Text><Text style={styles.progressSubtitle}>{completed} of {tasks.length} rituals honoured</Text><Text style={styles.focusStatus}>●  Saved on this device</Text></View><View style={styles.progressIcon}><Text style={styles.progressGlyph}>✦</Text></View></View><View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${tasks.length ? Math.round((completed / tasks.length) * 100) : 0}%` }]} /></View></View>
        <View style={styles.searchBox}><Text style={styles.searchGlyph}>⌕</Text><TextInput value={query} onChangeText={setQuery} placeholder="Search your tasks" placeholderTextColor="#a1a9a2" returnKeyType="search" style={styles.searchInput} accessibilityLabel="Search tasks" />{query.length > 0 && <Pressable onPress={() => setQuery('')} accessibilityLabel="Clear search"><Text style={styles.clearSearch}>×</Text></Pressable>}</View>
        <View style={styles.listHeader}><Text style={styles.listLabel}>{view === 'Completed' ? 'HONOURED RITUALS' : 'TODAY’S RITUALS'}</Text><Text style={styles.listCount}>{visibleTasks.length} {visibleTasks.length === 1 ? 'ritual' : 'rituals'}</Text></View>

        {loading ? <View style={styles.stateBox}><Text style={styles.stateTitle}>Loading your tasks…</Text></View> : storageError ? <View style={styles.stateBox}><Text style={styles.stateTitle}>Couldn’t access saved tasks</Text><Text style={styles.stateMessage}>Your task data is still on this device. Check storage access and try again.</Text><Pressable onPress={retryLoad} style={styles.retryButton}><Text style={styles.retryText}>Try again</Text></Pressable></View> : visibleTasks.length > 0 ? visibleTasks.map((task) => <TaskRow key={task.id} task={task} onToggle={() => toggleTask(task.id)} onDelete={() => deleteTask(task.id)} />) : <View style={styles.emptyState}><View style={styles.emptyIcon}><Text style={styles.emptyGlyph}>{query ? '⌕' : view === 'Completed' ? '✓' : '✳'}</Text></View><Text style={styles.emptyTitle}>{query ? 'No matching tasks' : view === 'Completed' ? 'Nothing completed yet' : 'You’re all caught up'}</Text><Text style={styles.emptyMessage}>{query ? 'Try searching for something else.' : view === 'Completed' ? 'Finished tasks will appear here.' : 'Add a task whenever something comes to mind.'}</Text></View>}

        {!loading && !storageError && <Text style={styles.footerText}>Small steps, meaningful days.  ✳</Text>}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.paper },
  content: { flexGrow: 1, paddingHorizontal: 22, paddingTop: 8, paddingBottom: 28 },
  topline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 14 },
  brandLabel: { color: colors.ink, fontSize: 12, fontWeight: '700', letterSpacing: 2 },
  dateText: { color: colors.muted, fontSize: 9, letterSpacing: 1, marginTop: 4 },
  avatar: { height: 34, width: 34, borderRadius: 17, backgroundColor: colors.raised, borderColor: 'rgba(203,182,238,0.45)', borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.accent, fontWeight: '700', fontSize: 13 },
  eyebrow: { color: colors.accent, fontWeight: '600', fontSize: 9, letterSpacing: 1.6 },
  headingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 7 },
  headingCopy: { flex: 1, paddingRight: 10 },
  heading: { color: colors.ink, fontSize: 30, lineHeight: 38, fontFamily: 'serif', fontWeight: '600', letterSpacing: -0.5 },
  subtitle: { color: '#aaa3ae', fontSize: 11, lineHeight: 17, marginTop: 4, fontFamily: 'serif', fontStyle: 'italic' },
  countBadge: { color: colors.accent, fontSize: 12, fontWeight: '700', minWidth: 32, height: 32, overflow: 'hidden', textAlign: 'center', textAlignVertical: 'center', borderRadius: 11, backgroundColor: 'rgba(232,222,248,0.1)', paddingTop: 8 },
  progressCard: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 15, marginTop: 21, padding: 15 },
  progressCopy: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  progressText: { flex: 1 },
  progressEyebrow: { color: '#a59daa', fontSize: 9, letterSpacing: 1.3, fontWeight: '600' },
  progressIcon: { height: 74, width: 74, borderRadius: 37, borderWidth: 4, borderColor: colors.raised, borderTopColor: colors.accent, borderRightColor: colors.accent, justifyContent: 'center', alignItems: 'center', transform: [{ rotate: '35deg' }] },
  progressGlyph: { fontSize: 20, color: colors.accent, fontWeight: '700', transform: [{ rotate: '-35deg' }] },
  progressTitle: { color: colors.ink, fontSize: 25, fontFamily: 'serif', fontWeight: '600', marginTop: 4 },
  manifested: { color: colors.muted, fontFamily: 'System', fontWeight: '400', fontSize: 11 },
  progressSubtitle: { color: colors.muted, fontSize: 10, marginTop: 3 },
  focusStatus: { color: '#a7baa9', fontSize: 9, marginTop: 9, letterSpacing: 0.2 },
  progressTrack: { height: 3, backgroundColor: '#3a2d2d', borderRadius: 4, marginTop: 13, overflow: 'hidden' },
  progressFill: { height: 3, backgroundColor: colors.accent, borderRadius: 4 },
  searchBox: { height: 42, backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 9, marginTop: 17, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 8 },
  searchGlyph: { fontSize: 23, color: '#929a93', lineHeight: 26 },
  searchInput: { flex: 1, paddingVertical: 0, fontSize: 11, color: colors.ink },
  clearSearch: { color: '#aaa2af', fontSize: 21, paddingHorizontal: 3 },
  listHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: colors.border, marginTop: 27, paddingHorizontal: 2, paddingBottom: 10 },
  listLabel: { color: '#aaa3ae', fontSize: 9, fontWeight: '600', letterSpacing: 1.35 },
  listCount: { color: '#928b96', fontSize: 9 },
  taskRow: { minHeight: 68, borderWidth: 1, borderColor: 'rgba(226,224,235,0.09)', backgroundColor: colors.card, borderRadius: 11, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 12, marginTop: 9 },
  check: { height: 20, width: 20, borderRadius: 6, borderWidth: 1, borderColor: '#756d78', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.paper },
  checked: { backgroundColor: colors.accent, borderColor: colors.accent },
  pressed: { opacity: 0.65 },
  checkMark: { color: '#201623', fontSize: 12, fontWeight: '700', marginTop: -1 },
  taskBody: { flex: 1, paddingVertical: 11 },
  taskTitle: { color: '#f0edf4', fontSize: 13, lineHeight: 19, fontFamily: 'serif', fontWeight: '500' },
  doneTitle: { textDecorationLine: 'line-through', color: '#89828e' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  categoryDot: { height: 6, width: 6, borderRadius: 3 },
  metaText: { color: '#9a929e', fontSize: 9, letterSpacing: 0.3, textTransform: 'uppercase' },
  metaSeparator: { color: '#746c76', fontSize: 11 },
  deleteButton: { height: 36, width: 32, justifyContent: 'center', alignItems: 'center' },
  deleteText: { color: '#aaa2ad', fontSize: 22, lineHeight: 25 },
  emptyState: { alignItems: 'center', paddingTop: 46, paddingBottom: 24 },
  emptyIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(232,222,248,0.08)', borderColor: 'rgba(232,222,248,0.16)', borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 13 },
  emptyGlyph: { color: colors.accent, fontSize: 22 },
  emptyTitle: { color: '#e9e5ed', fontSize: 16, fontWeight: '600', fontFamily: 'serif' },
  emptyMessage: { color: '#928c95', fontSize: 10, marginTop: 6, textAlign: 'center', lineHeight: 17 },
  stateBox: { alignItems: 'center', paddingVertical: 44 },
  stateTitle: { color: '#e9e5ed', fontWeight: '700', fontSize: 14 },
  stateMessage: { color: '#aaa3ae', fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 8, maxWidth: 280 },
  retryButton: { marginTop: 15, borderRadius: 7, backgroundColor: colors.accent, paddingHorizontal: 14, paddingVertical: 9 },
  retryText: { color: '#201623', fontSize: 12, fontWeight: '700' },
  footerText: { borderTopWidth: 1, borderTopColor: colors.border, marginTop: 43, paddingTop: 15, color: '#827b85', fontSize: 9, textAlign: 'center', letterSpacing: 0.4 },
})
