import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { TaskProvider } from '../src/tasks/TaskContext'

export default function RootLayout() {
  return (
    <TaskProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#181110' }, animation: 'fade' }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="add-task" options={{ presentation: 'modal', animation: 'slide_from_bottom', headerShown: true, title: 'New ritual', headerStyle: { backgroundColor: '#181110' }, headerTintColor: '#e8def8', headerShadowVisible: false, headerTitleStyle: { color: '#f5f5f7', fontFamily: 'serif' } }} />
      </Stack>
    </TaskProvider>
  )
}
