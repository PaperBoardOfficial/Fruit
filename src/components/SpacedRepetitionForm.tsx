import { View, Text, TextInput, Pressable, ScrollView, Switch, Platform } from "react-native";
import { useState, useEffect } from "react";
import BackButton from "@/src/components/BackButton";
import showAlert from "@/src/utils/alert";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

// Default schedule options
export const DEFAULT_SCHEDULES = [
    { name: "Default", intervals: [1, 7, 14, 30, 90, 180] },
    { name: "Intensive", intervals: [1, 3, 7, 14, 30, 60] },
    { name: "Extended", intervals: [1, 14, 30, 90, 180, 365] },
];

interface SpacedRepetitionFormProps {
    mode: 'create' | 'edit';
    initialValues?: {
        title: string;
        schedule: number[];
        reminderTime: string;
    };
    onSubmit: (data: { title: string; schedule: number[]; reminderTime: string }) => void;
    onDelete?: () => void;
}

export default function SpacedRepetitionForm({
    mode,
    initialValues,
    onSubmit,
    onDelete
}: SpacedRepetitionFormProps) {
    // Form state
    const [title, setTitle] = useState(initialValues?.title || "");
    const [selectedScheduleIndex, setSelectedScheduleIndex] = useState(0);
    const [customSchedule, setCustomSchedule] = useState(false);
    const [intervals, setIntervals] = useState<string[]>(
        DEFAULT_SCHEDULES[0].intervals.map(String)
    );

    // Time picker state
    const [reminderTime, setReminderTime] = useState(() => {
        // Create a new Date object set to 9:00 AM
        const defaultTime = new Date();
        defaultTime.setHours(9, 0, 0, 0);
        return defaultTime;
    });
    const [showTimePicker, setShowTimePicker] = useState(false);

    // Initialize form with initial values if in edit mode
    useEffect(() => {
        if (mode === 'edit' && initialValues) {
            setTitle(initialValues.title);

            // Try to find a matching default schedule
            const matchingScheduleIndex = DEFAULT_SCHEDULES.findIndex(
                schedule => JSON.stringify(schedule.intervals) === JSON.stringify(initialValues.schedule)
            );

            if (matchingScheduleIndex !== -1) {
                setSelectedScheduleIndex(matchingScheduleIndex);
                setCustomSchedule(false);
            } else {
                setCustomSchedule(true);
            }

            setIntervals(initialValues.schedule.map(String));

            // Set reminder time from item or default to 9:00 AM
            if (initialValues.reminderTime) {
                const [hours, minutes] = initialValues.reminderTime.split(':').map(Number);
                const time = new Date();
                time.setHours(hours, minutes, 0, 0);
                setReminderTime(time);
            }
        }
    }, [mode, initialValues]);

    // Format time for display
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Update intervals when changing schedule
    const handleScheduleChange = (index: number) => {
        setSelectedScheduleIndex(index);
        setIntervals(DEFAULT_SCHEDULES[index].intervals.map(String));
    };

    // Handle form submission
    const handleSubmit = () => {
        if (!title.trim()) {
            showAlert("Error", "Please enter what you studied");
            return;
        }

        // Get the selected schedule
        const schedule = customSchedule
            ? intervals.map((interval) => parseInt(interval) || 1)
            : DEFAULT_SCHEDULES[selectedScheduleIndex].intervals;

        // Format time as "HH:MM"
        const timeString = `${reminderTime.getHours().toString().padStart(2, '0')}:${reminderTime.getMinutes().toString().padStart(2, '0')}`;

        // Submit the data
        onSubmit({ title, schedule, reminderTime: timeString });
    };

    // Handle delete with confirmation
    const handleDelete = () => {
        if (!onDelete) return;

        showAlert(
            "Delete Item",
            "Are you sure you want to delete this study item?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: onDelete
                }
            ]
        );
    };

    return (
        <ScrollView className="flex-1 bg-white dark:bg-gray-900 p-4">
            <BackButton />

            <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                {mode === 'create' ? 'Add Study Item' : 'Edit Study Item'}
            </Text>

            {/* Title input */}
            <View className="mb-6">
                <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    What did you study?
                </Text>
                <TextInput
                    value={title}
                    onChangeText={setTitle}
                    placeholder="e.g., Geometry Formulas"
                    placeholderTextColor="#9ca3af"
                    className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-gray-800 dark:text-white"
                />
            </View>

            {/* Reminder time */}
            <View className="mb-6">
                <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Reminder Time
                </Text>
                <Pressable
                    onPress={() => setShowTimePicker(true)}
                    className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md flex-row justify-between items-center"
                >
                    <Text className="text-gray-800 dark:text-white">
                        {formatTime(reminderTime)}
                    </Text>
                    <Ionicons name="time-outline" size={20} color="#f97316" />
                </Pressable>

                {showTimePicker && (
                    <DateTimePicker
                        value={reminderTime}
                        mode="time"
                        is24Hour={true}
                        display="default"
                        onChange={(_, selectedTime) => selectedTime && setReminderTime(selectedTime)}
                    />
                )}
            </View>

            {/* Schedule selection */}
            <View className="mb-6">
                <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Review Schedule
                </Text>

                <View className="flex-row mb-4">
                    {DEFAULT_SCHEDULES.map((schedule, index) => (
                        <Pressable
                            key={schedule.name}
                            onPress={() => handleScheduleChange(index)}
                            className={`mr-2 px-4 py-2 rounded-full ${selectedScheduleIndex === index && !customSchedule
                                ? "bg-orange-500"
                                : "bg-gray-200 dark:bg-gray-700"
                                }`}
                        >
                            <Text
                                className={`${selectedScheduleIndex === index && !customSchedule
                                    ? "text-white"
                                    : "text-gray-800 dark:text-gray-300"
                                    }`}
                            >
                                {schedule.name}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                {/* Custom schedule toggle */}
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-gray-700 dark:text-gray-300 font-medium">
                        Custom Schedule
                    </Text>
                    <Switch
                        value={customSchedule}
                        onValueChange={setCustomSchedule}
                        trackColor={{ false: "#d1d5db", true: "#f97316" }}
                        thumbColor="#ffffff"
                    />
                </View>

                {/* Custom intervals (only visible if custom schedule is enabled) */}
                {customSchedule && (
                    <View className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                        <Text className="text-gray-700 dark:text-gray-300 mb-2">
                            Review intervals (in days)
                        </Text>
                        <View className="flex-row flex-wrap">
                            {intervals.map((interval, index) => (
                                <View key={index} className="w-1/3 pr-2 mb-2">
                                    <TextInput
                                        value={interval}
                                        onChangeText={(text) => {
                                            const newIntervals = [...intervals];
                                            newIntervals[index] = text;
                                            setIntervals(newIntervals);
                                        }}
                                        keyboardType="number-pad"
                                        className="bg-white dark:bg-gray-700 p-2 rounded-md text-gray-800 dark:text-white text-center"
                                        placeholder={`Review ${index + 1}`}
                                        placeholderTextColor="#9ca3af"
                                    />
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Preview of selected schedule */}
                <View className="mt-4">
                    <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                        Review Schedule Preview
                    </Text>
                    <View className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                        <Text className="text-gray-600 dark:text-gray-400">
                            {customSchedule
                                ? intervals.map((interval) => `${interval} days`).join(", ")
                                : DEFAULT_SCHEDULES[selectedScheduleIndex].intervals
                                    .map((interval) => `${interval} days`)
                                    .join(", ")}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Action buttons */}
            <View className="flex-row mt-6 mb-4">
                <Pressable
                    onPress={handleSubmit}
                    className="flex-1 bg-orange-500 p-4 rounded-lg"
                >
                    <Text className="text-white font-semibold text-center">
                        {mode === 'create' ? 'Create Study Item' : 'Save Changes'}
                    </Text>
                </Pressable>
            </View>

            {/* Delete button - only show in edit mode */}
            {mode === 'edit' && onDelete && (
                <Pressable
                    onPress={handleDelete}
                    className="mb-8 p-4 rounded-lg border border-red-500"
                >
                    <Text className="text-red-500 font-semibold text-center">
                        Delete Reminder
                    </Text>
                </Pressable>
            )}
        </ScrollView>
    );
}