import { Tabs } from 'expo-router'
import { Text } from 'react-native'

const lavender = '#e8def8'

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: lavender, tabBarInactiveTintColor: '#8e8e93', tabBarStyle: { height: 84, paddingTop: 8, paddingBottom: 20, backgroundColor: '#140c0b', borderTopColor: 'rgba(226,224,235,0.12)' }, tabBarLabelStyle: { fontSize: 9, fontWeight: '500', letterSpacing: 0.6, textTransform: 'uppercase' } }}>
      <Tabs.Screen name="index" options={{ title: 'Today', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 19 }}>◷</Text> }} />
      <Tabs.Screen name="inbox" options={{ title: 'Inbox', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 17 }}>▤</Text> }} />
      <Tabs.Screen name="upcoming" options={{ title: 'Upcoming', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 17 }}>▦</Text> }} />
      <Tabs.Screen name="completed" options={{ title: 'Done', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 19 }}>✓</Text> }} />
    </Tabs>
  )
}
