import BackButton from "@/src/components/BackButton";
import { View, Text, ScrollView } from "react-native";

export default function SpacedRepetitionSettingsScreen() {
  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      <BackButton />
      <View className="px-4">
        <View className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Review Settings
          </Text>
          <Text className="text-gray-600 dark:text-gray-300 mb-4">
            Customize your review schedule and algorithm
          </Text>
          
          <View className="bg-white dark:bg-gray-700 p-3 rounded-md mb-2">
            <Text className="text-gray-800 dark:text-white">New cards per day: 20</Text>
          </View>
          
          <View className="bg-white dark:bg-gray-700 p-3 rounded-md">
            <Text className="text-gray-800 dark:text-white">Reviews per day: 100</Text>
          </View>
        </View>
        
        <View className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
          <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Notifications
          </Text>
          <Text className="text-gray-600 dark:text-gray-300 mb-4">
            Configure reminder preferences
          </Text>
          
          <View className="bg-white dark:bg-gray-700 p-3 rounded-md">
            <Text className="text-gray-800 dark:text-white">Daily reminder: 8:00 AM</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
} 