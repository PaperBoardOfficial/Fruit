import { View, Text, ScrollView } from "react-native";
import BackButton from "@/src/components/BackButton";

export default function HabitsSettingsScreen() {  
  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      <BackButton />
      <View className="px-4">
        <View className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Tracking Settings
          </Text>
          <Text className="text-gray-600 dark:text-gray-300 mb-4">
            Customize how your habits are tracked
          </Text>

          <View className="bg-white dark:bg-gray-700 p-3 rounded-md mb-2">
            <Text className="text-gray-800 dark:text-white">Week starts on: Monday</Text>
          </View>

          <View className="bg-white dark:bg-gray-700 p-3 rounded-md">
            <Text className="text-gray-800 dark:text-white">Default reminder time: 9:00 AM</Text>
          </View>
        </View>

        <View className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
          <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Display Settings
          </Text>
          <Text className="text-gray-600 dark:text-gray-300 mb-4">
            Configure how habits are displayed
          </Text>

          <View className="bg-white dark:bg-gray-700 p-3 rounded-md">
            <Text className="text-gray-800 dark:text-white">Sort by: Creation date</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
} 