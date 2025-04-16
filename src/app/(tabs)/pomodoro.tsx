import React, { useState } from 'react';
import { Text, View, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import usePomodoroStore from "@/src/store/usePomodoroStore";
import SessionStatus from "@/src/components/SessionStatus";
import TimerDisplay from "@/src/components/TimerDisplay";
import pomodoroService from "@/src/services/pomodoroService";
import LabelSelectionModal from '../../components/LabelSelectionModal';
import { Label } from '../../entities/Label';

export default function PomodoroScreen() {
  const { minutes, seconds, isActive, status, selectedLabel, setSelectedLabel } = usePomodoroStore();
  const [labelModalVisible, setLabelModalVisible] = useState(false);

  const handleStartPause = async () => {
    if (isActive) {
      await pomodoroService.pauseTimer();
    } else {
      await pomodoroService.startTimer();
    }
  };

  const handleReset = async () => {
    await pomodoroService.resetTimer();
  };

  const handleSkip = async () => {
    await pomodoroService.skipToNextSession();
  };

  const handleSelectLabel = (label: Label | null) => {
    setSelectedLabel(label);
    setLabelModalVisible(false);
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
            sessionCount={usePomodoroStore(state => state.sessionCount)}
            sessionsUntilLongBreak={usePomodoroStore(state => state.sessionsUntilLongBreak)}
          />

          <TimerDisplay minutes={minutes} seconds={seconds} />

          <View className="flex-row justify-center w-full mb-4 mt-8">
            <Pressable
              className={`px-10 py-3 rounded-3xl mr-8 ${isActive ? 'bg-orange-300' : 'bg-orange-400'}`}
              onPress={handleStartPause}
            >
              <Text className="text-white font-medium">
                {isActive ? 'Pause' : 'Start'}
              </Text>
            </Pressable>

            <Pressable
              className="bg-gray-500 px-10 py-3 rounded-3xl"
              onPress={handleReset}
            >
              <Text className="text-white font-medium">Reset</Text>
            </Pressable>
          </View>

          <Pressable
            className="bg-gray-300 dark:bg-gray-600 px-4 py-2 rounded-full flex-row items-center justify-center"
            onPress={handleSkip}
          >
            <Ionicons name="play-skip-forward-outline" size={20} color="#6b7280" />
            <Text className="text-gray-600 dark:text-gray-300 ml-2">
              Skip
            </Text>
          </Pressable>

          <Pressable
            className="bg-gray-300 dark:bg-gray-600 px-4 py-2 rounded-full flex-row items-center justify-center"
            onPress={() => setLabelModalVisible(true)}
          >
            <Ionicons name="pricetag-outline" size={20} color="#555" />
            <Text className="text-gray-600 dark:text-gray-300 ml-2">
              {selectedLabel ? selectedLabel.name : 'Add Label'}
            </Text>
          </Pressable>
        </View>

        <LabelSelectionModal
          visible={labelModalVisible}
          onClose={() => setLabelModalVisible(false)}
          onSelectLabel={handleSelectLabel}
          selectedLabelId={selectedLabel?.id}
        />
      </ScrollView>
    </View>
  );
} 