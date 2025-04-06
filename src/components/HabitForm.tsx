import { View, Text, TextInput, Pressable, ScrollView, Switch } from "react-native";
import { useState } from "react";
import BackButton from "@/src/components/BackButton";
import { COLOR_MAP, DAY_NAMES } from "@/src/types/habits";
import showAlert from '@/src/utils/alert';
import { Habit } from "@/src/types/habits";

interface HabitFormProps {
    mode: 'create' | 'edit';
    initialData?: Habit;
    onSubmit: (data: Omit<Habit, 'id' | 'createdAt' | 'completedDates' | 'values'>) => void;
    onDelete?: () => void;
}

export default function HabitForm({ mode, initialData, onSubmit, onDelete }: HabitFormProps) {
    // Form state
    const [name, setName] = useState(initialData?.name || "");
    const [selectedColor, setSelectedColor] = useState(initialData?.color || "blue");
    const [selectedDays, setSelectedDays] = useState<string[]>(initialData?.targetDays || []);
    const [isQuantitative, setIsQuantitative] = useState(initialData?.isQuantitative || false);
    const [unit, setUnit] = useState(initialData?.unit || "");

    // Toggle a day selection
    const toggleDay = (day: string) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    // Handle form submission
    const handleSubmit = () => {
        if (!name.trim()) {
            showAlert("Error", "Habit name is required");
            return;
        }

        if (selectedDays.length === 0) {
            showAlert("Error", "Please select at least one day");
            return;
        }

        onSubmit({
            name,
            color: selectedColor,
            targetDays: selectedDays,
            isQuantitative,
            unit: isQuantitative ? unit : undefined,
        });
    };

    // Handle delete confirmation
    const handleDelete = () => {
        if (!onDelete) return;

        showAlert(
            'Delete Habit',
            'Are you sure you want to delete this habit? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: onDelete
                }
            ]
        );
    };

    return (
        <ScrollView className="flex-1 bg-white dark:bg-gray-900 p-4">
            <BackButton />

            {/* Name input */}
            <View className="mb-6">
                <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Habit
                </Text>
                <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g., Morning Run"
                    placeholderTextColor="#9ca3af"
                    className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-gray-800 dark:text-white"
                />
            </View>

            {/* Color selection */}
            <View className="mb-6">
                <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Color
                </Text>
                <View className="flex-row">
                    {Object.entries(COLOR_MAP).map(([color, hex]) => (
                        <Pressable
                            key={color}
                            onPress={() => setSelectedColor(color)}
                            className={`w-10 h-10 rounded-full mr-3 ${selectedColor === color ? 'border-2 border-gray-400 dark:border-gray-300' : ''
                                }`}
                            style={{ backgroundColor: hex }}
                        />
                    ))}
                </View>
            </View>

            {/* Day selection with circular buttons */}
            <View className="mb-6">
                <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Repeat on days
                </Text>
                <View className="flex-row space-x-2">
                    {DAY_NAMES.map(day => (
                        <Pressable
                            key={day}
                            onPress={() => toggleDay(day)}
                            className={`w-10 h-10 rounded-full justify-center items-center ${selectedDays.includes(day)
                                    ? 'bg-gray-400 dark:bg-gray-500'
                                    : 'bg-gray-200 dark:bg-gray-700'
                                }`}
                        >
                            <Text
                                className={`font-medium ${selectedDays.includes(day)
                                        ? 'text-white'
                                        : 'text-gray-800 dark:text-gray-300'
                                    }`}
                            >
                                {day}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </View>

            {/* Quantitative toggle */}
            <View className="mb-6 flex-row justify-between items-center">
                <Text className="text-gray-700 dark:text-gray-300 font-medium">
                    Track with numbers
                </Text>
                <Switch
                    value={isQuantitative}
                    onValueChange={setIsQuantitative}
                    trackColor={{ false: "#d1d5db", true: "#f97316" }}
                    thumbColor="#ffffff"
                />
            </View>

            {/* Unit input (only visible if quantitative) */}
            {isQuantitative && (
                <View className="mb-6">
                    <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                        Unit
                    </Text>
                    <TextInput
                        value={unit}
                        onChangeText={setUnit}
                        placeholder="e.g., miles, pages, minutes"
                        placeholderTextColor="#9ca3af"
                        className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-gray-800 dark:text-white"
                    />
                </View>
            )}

            {/* Action button */}
            <View className="flex-row mt-6 mb-4">
                <Pressable
                    onPress={handleSubmit}
                    className="flex-1 bg-orange-500 p-4 rounded-lg"
                >
                    <Text className="text-white font-semibold text-center">
                        {mode === 'create' ? 'Create' : 'Save Changes'}
                    </Text>
                </Pressable>
            </View>

            {/* Delete button - only show in edit mode */}
            {mode === 'edit' && onDelete && (
                <Pressable
                    onPress={handleDelete}
                    className="mb-8 p-4 rounded-lg border border-red-500"
                >
                    <Text className="text-red-500 font-semibold text-center">Delete Habit</Text>
                </Pressable>
            )}
        </ScrollView>
    );
}
