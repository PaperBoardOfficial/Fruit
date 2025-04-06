import { useRouter } from "expo-router";
import useHabitsStore from "@/src/store/useHabitsStore";
import HabitForm from "@/src/components/HabitForm";
import { Habit } from "@/src/types/habits";

export default function CreateHabitScreen() {
    const router = useRouter();
    const addHabit = useHabitsStore(state => state.addHabit);

    const handleCreate = (habitData: Omit<Habit, 'id' | 'createdAt' | 'completedDates' | 'values'>) => {
        addHabit(habitData);
        router.back();
    };

    return (
        <HabitForm
            mode="create"
            onSubmit={handleCreate}
        />
    );
} 