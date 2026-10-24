import { Link } from 'expo-router'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import TaskScreen from '../../src/components/TaskScreen'

export default function TodayScreen() {
  return <View style={styles.container}><TaskScreen view="Today" /><Link href="/add-task" asChild><Pressable accessibilityRole="button" accessibilityLabel="Add a task" style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}><Text style={styles.plus}>＋</Text></Pressable></Link></View>
}

const styles = StyleSheet.create({ container: { flex: 1 }, addButton: { position: 'absolute', right: 22, bottom: 102, height: 54, width: 54, borderRadius: 27, backgroundColor: '#e8def8', borderWidth: 1.5, borderColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 8, shadowColor: '#cbb6ee', shadowOpacity: 0.32, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } }, plus: { color: '#181110', fontSize: 30, lineHeight: 34, marginTop: -2 }, pressed: { opacity: 0.8, transform: [{ scale: 0.97 }] } })
