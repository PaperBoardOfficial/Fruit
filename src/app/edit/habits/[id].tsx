import { useRouter, useLocalSearchParams } from "expo-router";
import useHabitsStore from "@/src/store/useHabitsStore";
import HabitForm from "@/src/components/HabitForm";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import showAlert from '@/src/utils/alert';
import { Habit } from "@/src/types/habits";

export default function EditHabitScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const getHabitById = useHabitsStore(state => state.getHabitById);
    const updateHabit = useHabitsStore(state => state.updateHabit);
    const removeHabit = useHabitsStore(state => state.removeHabit);

    const [habit, setHabit] = useState<Habit | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) {
            showAlert("Error", "No habit ID provided");
            router.back();
            return;
        }

        const habitData = getHabitById(id);
        if (!habitData) {
            showAlert("Error", "Habit not found");
            router.back();
            return;
        }

        setHabit(habitData);
        setLoading(false);
    }, [id, getHabitById, router]);

    const handleUpdate = (updates: Omit<Habit, 'id' | 'createdAt' | 'completedDates' | 'values'>) => {
        if (!id) return;
        updateHabit(id, updates);
        router.back();
    };

    const handleDelete = () => {
        if (!id) return;
        removeHabit(id);
        router.back();
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white dark:bg-gray-900">
                <Text className="text-gray-800 dark:text-gray-200">Loading...</Text>
            </View>
        );
    }

    if (!habit) {
        return null;
    }

    return (
        <HabitForm
            mode="edit"
            initialData={habit}
            onSubmit={handleUpdate}
            onDelete={handleDelete}
        />
    );
} 