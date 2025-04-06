import { Text, View, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import usePomodoroStore from "@/src/store/usePomodoroStore";
import SessionStatus from "@/src/components/SessionStatus";
import TimerDisplay from "@/src/components/TimerDisplay";

export default function PomodoroScreen() {
  const isActive = usePomodoroStore(state => state.isActive)
  const status = usePomodoroStore(state => state.status)
  const sessionCount = usePomodoroStore(state => state.sessionCount)
  const sessionsUntilLongBreak = usePomodoroStore(state => state.sessionsUntilLongBreak)
  const minutes = usePomodoroStore(state => state.minutes)
  const seconds = usePomodoroStore(state => state.seconds)
  const startTimer = usePomodoroStore(state => state.startTimer)
  const pauseTimer = usePomodoroStore(state => state.pauseTimer)
  const resetTimer = usePomodoroStore(state => state.resetTimer)
  const skipToNextSession = usePomodoroStore(state => state.skipToNextSession)

  const toggleTimer = async () => {
    if (isActive) {
      await pauseTimer();
    } else {
      await startTimer();
    }
  };


  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView className="flex-1 pt-5 p-4">

        <View className="flex-row justify-end mb-4">
          <Pressable
            onPress={() => router.push("/settings/pomodoro")}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Ionicons name="settings-outline" size={24} color="#f97316" />
          </Pressable>
        </View>

        <View className="items-center">
          <SessionStatus
            status={status}
            sessionCount={sessionCount}
            sessionsUntilLongBreak={sessionsUntilLongBreak}
          />

          <TimerDisplay minutes={minutes} seconds={seconds} />

          <View className="flex-row justify-center w-full mb-4 mt-8">
            <Pressable
              className={`px-10 py-3 rounded-3xl mr-8 ${isActive ? 'bg-orange-300' : 'bg-orange-400'}`}
              onPress={toggleTimer}
            >
              <Text className="text-white font-medium">
                {isActive ? 'Pause' : 'Start'}
              </Text>
            </Pressable>

            <Pressable
              className="bg-gray-500 px-10 py-3 rounded-3xl"
              onPress={resetTimer}
            >
              <Text className="text-white font-medium">Reset</Text>
            </Pressable>
          </View>

          <Pressable
            className="bg-gray-300 dark:bg-gray-600 px-4 py-2 rounded-full flex-row items-center justify-center"
            onPress={skipToNextSession}
          >
            <Ionicons name="play-skip-forward-outline" size={20} color="#6b7280" />
            <Text className="text-gray-600 dark:text-gray-300 ml-2">
              Skip
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
} 