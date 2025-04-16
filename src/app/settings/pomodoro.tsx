import { View, Text, Pressable, ScrollView, TextInput, Switch } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import usePomodoroStore from "@/src/store/usePomodoroStore";
import BackButton from "@/src/components/BackButton";

export default function PomodoroSettingsScreen() {
  const router = useRouter();
  const focusMinutes = usePomodoroStore(state => state.focusMinutes)
  const breakMinutes = usePomodoroStore(state => state.breakMinutes)
  const longBreakMinutes = usePomodoroStore(state => state.longBreakMinutes)
  const sessionsUntilLongBreak = usePomodoroStore(state => state.sessionsUntilLongBreak)
  const autoContinue = usePomodoroStore(state => state.autoContinue)

  // Local state for input values
  const [focusInput, setFocusInput] = useState(focusMinutes.toString());
  const [breakInput, setBreakInput] = useState(breakMinutes.toString());
  const [longBreakInput, setLongBreakInput] = useState(longBreakMinutes.toString());
  const [sessionsInput, setSessionsInput] = useState(sessionsUntilLongBreak.toString());
  const [isAutoContinue, setIsAutoContinue] = useState(autoContinue);

  // Save all settings
  const saveSettings = () => {
    const focusMin = Math.max(1, Math.min(60, parseInt(focusInput) || 25));
    const breakMin = Math.max(1, Math.min(30, parseInt(breakInput) || 5));
    const longBreakMin = Math.max(1, Math.min(60, parseInt(longBreakInput) || 15));
    const sessions = Math.max(1, Math.min(10, parseInt(sessionsInput) || 4));
    usePomodoroStore.setState({
      focusMinutes: focusMin,
      breakMinutes: breakMin,
      longBreakMinutes: longBreakMin,
      sessionsUntilLongBreak: sessions,
      autoContinue: isAutoContinue
    })
    router.back();
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      <BackButton />

      <View className="px-4">

        {/* Focus Session Setting */}
        <View className="bg-white dark:bg-gray-700 p-3 rounded-md mb-2">
          <Text className="text-gray-800 dark:text-white mb-2">Focus Session</Text>
          <View className="flex-row items-center">
            <TextInput
              className="flex-1 bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-white px-3 py-2 rounded-md"
              keyboardType="number-pad"
              value={focusInput}
              onChangeText={setFocusInput}
              maxLength={2}
            />
            <Text className="ml-2 text-gray-800 dark:text-white">minutes</Text>
          </View>
        </View>

        {/* Break Session Setting */}
        <View className="bg-white dark:bg-gray-700 p-3 rounded-md mb-2">
          <Text className="text-gray-800 dark:text-white mb-2">Break Session</Text>
          <View className="flex-row items-center">
            <TextInput
              className="flex-1 bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-white px-3 py-2 rounded-md"
              keyboardType="number-pad"
              value={breakInput}
              onChangeText={setBreakInput}
              maxLength={2}
            />
            <Text className="ml-2 text-gray-800 dark:text-white">minutes</Text>
          </View>
        </View>

        {/* Long Break Session Setting */}
        <View className="bg-white dark:bg-gray-700 p-3 rounded-md mb-2">
          <Text className="text-gray-800 dark:text-white mb-2">Long Break Session</Text>
          <View className="flex-row items-center">
            <TextInput
              className="flex-1 bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-white px-3 py-2 rounded-md"
              keyboardType="number-pad"
              value={longBreakInput}
              onChangeText={setLongBreakInput}
              maxLength={2}
            />
            <Text className="ml-2 text-gray-800 dark:text-white">minutes</Text>
          </View>
        </View>

        {/* Sessions Until Long Break Setting */}
        <View className="bg-white dark:bg-gray-700 p-3 rounded-md">
          <Text className="text-gray-800 dark:text-white mb-2">Sessions Until Long Break</Text>
          <View className="flex-row items-center">
            <TextInput
              className="flex-1 bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-white px-3 py-2 rounded-md"
              keyboardType="number-pad"
              value={sessionsInput}
              onChangeText={setSessionsInput}
              maxLength={2}
            />
            <Text className="ml-2 text-gray-800 dark:text-white">sessions</Text>
          </View>
        </View>

        {/* Auto-Continue Setting */}

        <View className="bg-white dark:bg-gray-700 p-4 rounded-md">
          <View className="flex-row justify-between items-center">
            <View className="flex-1 mr-4">
              <Text className="text-gray-800 dark:text-white font-medium">Auto-Continue</Text>
              <Text className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                Automatically start the next session
              </Text>
            </View>
            <View>
              <Switch
                trackColor={{ false: "#767577", true: "#f97316" }}
                thumbColor={isAutoContinue ? "#fff" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={setIsAutoContinue}
                value={isAutoContinue}
              />
            </View>
          </View>
        </View>

        {/* Save Button */}
        <Pressable
          className="bg-orange-500 py-3 rounded-lg mb-6"
          onPress={saveSettings}
        >
          <Text className="text-white font-semibold text-center">Save Settings</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
} 