import React from 'react';
import { View, Text } from "react-native";
import { SessionStatus as SessionStatusEnum } from '@/src/types/pomodoro';

interface SessionStatusProps {
  status: SessionStatusEnum;
  sessionCount: number;
  sessionsUntilLongBreak: number;
}

export default function SessionStatus({
  status,
  sessionCount,
  sessionsUntilLongBreak
}: SessionStatusProps) {

  return (
    <View className="items-center mb-8">
      <Text className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
        {status}
      </Text>
      <Text className="text-gray-600 dark:text-gray-400 text-sm">
        {(sessionCount % sessionsUntilLongBreak)} / {sessionsUntilLongBreak}
      </Text>
      <Text className="text-gray-600 dark:text-gray-400 text-sm">
        Total: {sessionCount}
      </Text>

    </View>
  );
} 