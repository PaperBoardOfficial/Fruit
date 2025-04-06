import { View, Text, ScrollView, Pressable, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import useHabitsStore from "@/src/store/useHabitsStore";
import { useState } from "react";
import { DayInfo, COLOR_MAP, DAY_NAMES } from "@/src/types/habits";

// Generate days starting from a specific date
const generateDays = (startDate: Date, count: number): DayInfo[] => {
  const days: DayInfo[] = [];

  for (let i = 0; i < count; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() - i);

    // Create a dateString in DD-MM-YYYY format for unique identification
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${day}-${month}-${year}`;

    days.push({
      dayName: DAY_NAMES[date.getDay()],
      day: day,
      month: month,
      date: date,
      dateString: dateString
    });
  }

  return days;
};


export default function HabitsScreen() {
  const habits = useHabitsStore(state => state.habits);
  const toggleCompletion = useHabitsStore(state => state.toggleCompletion);
  const updateValue = useHabitsStore(state => state.updateValue);

  const [days, setDays] = useState<DayInfo[]>(() =>
    generateDays(new Date(), 14)
  );

  // Helper function to get color hex value
  const getColorHex = (colorName: string) => {
    return COLOR_MAP[colorName as keyof typeof COLOR_MAP] || '#3b82f6';
  };

  // Load more days when reaching the end
  const loadMoreDays = () => {
    if (days.length === 0) return;

    // Get the oldest date we currently have
    const oldestDate = days[days.length - 1].date;

    // Generate 7 more days starting from the day after the oldest
    const nextStartDate = new Date(oldestDate);
    nextStartDate.setDate(oldestDate.getDate() - 1);

    const newDays = generateDays(nextStartDate, 7);
    setDays([...days, ...newDays]);
  };

  // Handle scroll to check if we need to load more days
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const viewWidth = event.nativeEvent.layoutMeasurement.width;
    const contentWidth = event.nativeEvent.contentSize.width;

    // Check if we're near the end and should load more days
    // Load more when within 20% of the end
    if (scrollX + viewWidth > contentWidth * 0.8) {
      loadMoreDays();
    }
  };

  // Check if a habit is completed for a specific date
  const isCompletedForDate = (habit: any, dateString: string): boolean => {
    return habit.completedDates && habit.completedDates[dateString];
  };

  // Toggle completion for a specific date
  const toggleCompletionForDate = (habitId: string, dateString: string) => {
    toggleCompletion(habitId, dateString);
  };

  // Update value for a specific date
  const updateValueForDate = (habitId: string, dateString: string, value: string) => {
    updateValue(habitId, dateString, value);
  };

  return (
    <View className="flex-1 bg-gray-100 dark:bg-gray-900">
      {/* Header with buttons */}
      <View className="flex-row justify-end p-4">
        <Pressable
          onPress={() => router.push("/create/habits")}
          className="mr-4"
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Ionicons name="add" size={28} color="#f97316" />
        </Pressable>
        <Pressable
          onPress={() => router.push("/settings/habits")}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Ionicons name="settings-outline" size={24} color="#f97316" />
        </Pressable>
      </View>

      {/* Main content with fixed left column and scrollable right area */}
      <View className="flex-1 flex-row">
        {/* Fixed left column for habit names */}
        <View className="w-[150px]">
          {/* Top left corner named "Habits" */}
          <View className="p-2 bg-gray-200 dark:bg-gray-800 h-[60px]">
            <Text className="text-gray-500 dark:text-gray-400 font-medium">Habits</Text>
          </View>

          {/* Habit names column */}
          {habits.length === 0 ? (
            <View className="p-4">
              <Text className="text-gray-500 dark:text-gray-400">
                No habits yet
              </Text>
            </View>
          ) : (
            habits.map((habit) => (
              <Pressable
                key={habit.id}
                className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 justify-center h-[60px]"
                onPress={() => router.push(`/edit/habits/${habit.id}`)}
              >
                <Text style={{ color: getColorHex(habit.color) }}>
                  {habit.name}
                </Text>
              </Pressable>
            ))
          )}
        </View>

        {/* Scrollable area for days and habit completions */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          className="flex-1"
        >
          <View>
            {/* Days header row */}
            <View className="flex-row bg-gray-200 dark:bg-gray-800">
              {days.map((day) => (
                <View
                  key={day.dateString}
                  className="items-center p-2 w-[70px] h-[60px]"
                >
                  <Text className="text-gray-500 dark:text-gray-400 font-medium">{day.dayName}</Text>
                  <Text className="text-gray-500 dark:text-gray-400">{`${day.day}/${day.month}`}</Text>
                </View>
              ))}
            </View>

            {/* Habit completion cells */}
            {habits.length === 0 ? (
              <View className="p-8 items-center">
                <Text className="text-gray-500 dark:text-gray-400 text-center">
                  Tap the + button to create a habit.
                </Text>
              </View>
            ) : (
              habits.map((habit) => (
                <View key={habit.id} className="flex-row border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                  {days.map((day) => {
                    const isCompleted = isCompletedForDate(habit, day.dateString);
                    const value = habit.values?.[day.dateString];
                    const shouldShow = habit.targetDays.includes(day.dayName);

                    return (
                      <Pressable
                        key={day.dateString}
                        className="items-center justify-center p-4 w-[70px] h-[60px]"
                        onPress={() => {
                          if (shouldShow) {
                            if (habit.isQuantitative) {
                              const newValue = prompt("Enter value");
                              if (newValue) {
                                updateValueForDate(habit.id, day.dateString, newValue);
                              }
                            } else {
                              toggleCompletionForDate(habit.id, day.dateString);
                            }
                          }
                        }}
                        disabled={!shouldShow}
                      >
                        {shouldShow ? (
                          habit.isQuantitative ? (
                            <View>
                              <Text style={{ color: getColorHex(habit.color) }} className="font-bold text-center">
                                {value || '0'}
                              </Text>
                              <Text className="text-gray-400 text-xs text-center">
                                {habit.unit}
                              </Text>
                            </View>
                          ) : (
                            isCompleted ? (
                              <Ionicons
                                name="checkmark"
                                size={24}
                                color={getColorHex(habit.color)}
                              />
                            ) : (
                              <Ionicons name="close" size={24} color="#d1d5db" />
                            )
                          )
                        ) : (
                          <Text className="text-gray-300 dark:text-gray-700">-</Text>
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
} 