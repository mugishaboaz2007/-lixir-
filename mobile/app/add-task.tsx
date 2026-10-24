import { router } from 'expo-router'
import { useState } from 'react'
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTasks } from '../src/tasks/useTasks'
import type { TaskCategory } from '../src/tasks/types'

const options: TaskCategory[] = ['Personal', 'Work', 'Other']

function isValidDate(value: string) {
  if (!value) return true
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

export default function AddTaskScreen() {
  const { addTask, storageError } = useTasks()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<TaskCategory>('Personal')
  const [dueDate, setDueDate] = useState('')
  const [dateTouched, setDateTouched] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const validDate = isValidDate(dueDate)

  function submit() {
    const cleanTitle = title.trim()
    if (!cleanTitle) { Alert.alert('Add a ritual', 'Enter a short description before saving.'); return }
    if (!validDate) { setDateTouched(true); Alert.alert('Check the date', 'Enter a real date in YYYY-MM-DD format, or leave it blank.'); return }
    if (storageError) { Alert.alert('Storage unavailable', 'Your ritual could not be saved. Restore device storage access and try again.'); return }
    setSubmitting(true)
    addTask(cleanTitle, category, dueDate)
    router.back()
  }

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
          <View style={styles.introIcon}><Text style={styles.introGlyph}>✦</Text></View>
          <Text style={styles.eyebrow}>A MOMENT FOR WHAT MATTERS</Text>
          <Text style={styles.heading}>Consecrate a ritual.</Text>
          <Text style={styles.subtitle}>A small intention can shape the whole day.</Text>

          <Text style={styles.label}>RITUAL NAME</Text>
          <TextInput autoFocus value={title} onChangeText={setTitle} placeholder="Whisper a new ritual…" placeholderTextColor="#807982" maxLength={120} returnKeyType="done" onSubmitEditing={submit} style={styles.titleInput} accessibilityLabel="Ritual name" />
          <Text style={styles.helper}>{title.length}/120</Text>

          <Text style={[styles.label, styles.sectionLabel]}>COLLECTION</Text>
          <View style={styles.categories}>{options.map((item) => <Pressable key={item} accessibilityRole="radio" accessibilityState={{ selected: category === item }} onPress={() => setCategory(item)} style={[styles.categoryOption, category === item && styles.categorySelected]}><Text style={[styles.categoryText, category === item && styles.categoryTextSelected]}>{item}</Text></Pressable>)}</View>

          <Text style={[styles.label, styles.sectionLabel]}>TEMPORAL HORIZON <Text style={styles.optional}>OPTIONAL</Text></Text>
          <TextInput value={dueDate} onChangeText={setDueDate} onBlur={() => setDateTouched(true)} placeholder="YYYY-MM-DD" placeholderTextColor="#807982" keyboardType="numbers-and-punctuation" maxLength={10} style={[styles.dateInput, dateTouched && !validDate && styles.invalidInput]} accessibilityLabel="Due date, optional, year month day" />
          <Text style={[styles.helper, dateTouched && !validDate && styles.errorText]}>{dateTouched && !validDate ? 'Enter a valid date like 2026-10-22.' : 'Leave blank for an open-ended ritual.'}</Text>

          <Pressable disabled={submitting} accessibilityRole="button" onPress={submit} style={({ pressed }) => [styles.saveButton, pressed && styles.savePressed, submitting && styles.saveDisabled]}><Text style={styles.saveText}>✦  Consecrate ritual</Text></Pressable>
          <Pressable onPress={() => router.back()} style={styles.cancelButton}><Text style={styles.cancelText}>Return to sanctuary</Text></Pressable>
          <Text style={styles.sealNote}>Saved privately on this device</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#181110' }, flex: { flex: 1 }, content: { paddingHorizontal: 23, paddingTop: 23, paddingBottom: 30 },
  introIcon: { width: 43, height: 43, borderRadius: 14, backgroundColor: '#2a1e1a', borderColor: 'rgba(232,222,248,0.16)', borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }, introGlyph: { color: '#e8def8', fontSize: 21 },
  eyebrow: { color: '#cbb6ee', fontSize: 9, letterSpacing: 1.5, fontWeight: '600' }, heading: { color: '#f5f5f7', fontSize: 26, fontFamily: 'serif', fontWeight: '600', marginTop: 8 }, subtitle: { color: '#aaa3ae', fontSize: 11, fontFamily: 'serif', fontStyle: 'italic', marginTop: 5 },
  label: { color: '#a59daa', fontWeight: '600', fontSize: 9, letterSpacing: 1.3, marginTop: 30, marginBottom: 9 }, titleInput: { minHeight: 49, borderWidth: 1, borderColor: 'rgba(226,224,235,0.14)', borderRadius: 9, backgroundColor: '#221715', paddingHorizontal: 13, fontSize: 12, color: '#f5f5f7' }, helper: { color: '#8e8e93', fontSize: 9, marginTop: 6 }, sectionLabel: { marginTop: 25 }, optional: { color: '#827b85', fontSize: 8, letterSpacing: 0.7 },
  categories: { flexDirection: 'row', gap: 9 }, categoryOption: { borderWidth: 1, borderColor: 'rgba(226,224,235,0.14)', borderRadius: 8, backgroundColor: '#221715', paddingVertical: 9, paddingHorizontal: 15 }, categorySelected: { backgroundColor: 'rgba(232,222,248,0.12)', borderColor: 'rgba(232,222,248,0.38)' }, categoryText: { color: '#aaa3ae', fontSize: 11 }, categoryTextSelected: { color: '#e8def8', fontWeight: '700' },
  dateInput: { minHeight: 47, borderWidth: 1, borderColor: 'rgba(226,224,235,0.14)', borderRadius: 9, backgroundColor: '#221715', paddingHorizontal: 13, fontSize: 12, color: '#f5f5f7' }, invalidInput: { borderColor: '#c8796c' }, errorText: { color: '#d8948b' },
  saveButton: { marginTop: 31, height: 49, borderRadius: 9, backgroundColor: '#e8def8', borderWidth: 1, borderColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, shadowColor: '#cbb6ee', shadowOpacity: 0.16, shadowRadius: 12, elevation: 3 }, savePressed: { opacity: 0.82 }, saveDisabled: { opacity: 0.6 }, saveText: { color: '#201623', fontSize: 11, fontWeight: '700', letterSpacing: 0.4 }, cancelButton: { alignSelf: 'center', padding: 13, marginTop: 4 }, cancelText: { color: '#aaa3ae', fontSize: 10, fontWeight: '600' }, sealNote: { color: '#746c76', fontSize: 9, textAlign: 'center', marginTop: 17, letterSpacing: 0.3 },
})
