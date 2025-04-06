import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text, useColorScheme } from "react-native";

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#111827' : 'white',
          paddingTop: 5,
          height: 60,
          borderTopColor: isDarkMode ? '#374151' : '#e5e7eb',
        },
        tabBarActiveTintColor: "#f97316", // orange-500
        tabBarInactiveTintColor: "#6b7280", // gray-500,
        headerShown: false,
      }}
    >

      <Tabs.Screen
        name="pomodoro"
        options={{
          title: "Pomodoro",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="timer-outline" size={size} color={color} />
          ),
          tabBarLabel: ({ color }) => (
            <Text className="text-xs mb-1" style={{ color }}>Pomodoro</Text>
          ),
        }}
      />

      <Tabs.Screen
        name="spaced-repetition"
        options={{
          title: "Spaced Repetition",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="repeat-outline" size={size} color={color} />
          ),
          tabBarLabel: ({ color }) => (
            <Text className="text-xs mb-1" style={{ color }}>Repetition</Text>
          ),
        }}
      />

      <Tabs.Screen
        name="habits"
        options={{
          title: "Habit Tracker",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkbox-outline" size={size} color={color} />
          ),
          tabBarLabel: ({ color }) => (
            <Text className="text-xs mb-1" style={{ color }}>Habits</Text>
          ),
        }}
      />
    </Tabs>
  );
} 