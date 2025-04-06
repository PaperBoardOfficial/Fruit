import { View, Text } from "react-native";

interface TimerDisplayProps {
  minutes: number;
  seconds: number;
}

export default function TimerDisplay({ minutes, seconds }: TimerDisplayProps) {
  return (
    <View className="bg-gray-100 dark:bg-gray-800 rounded-full w-64 h-64 flex items-center justify-center">
      <Text className="text-6xl font-bold text-gray-800 dark:text-white">
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </Text>
    </View>
  );
} 