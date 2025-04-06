import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { nanoid } from 'nanoid';
import { Habit } from "@/src/types/habits";

interface HabitsState {
    habits: Habit[];
    addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => void;
    updateHabit: (id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt'>>) => void;
    removeHabit: (id: string) => void;
    toggleCompletion: (habitId: string, dateString: string) => void;
    updateValue: (habitId: string, dateString: string, value: string) => void;
    getHabitById: (id: string) => Habit | undefined;
}

const useHabitsStore = create<HabitsState>()(
    persist(
        (set, get) => ({
            habits: [],

            addHabit: (newHabit) => set((state) => ({
                habits: [
                    ...state.habits,
                    {
                        ...newHabit,
                        id: nanoid(),
                        createdAt: Date.now(),
                        completedDates: {},
                        values: {},
                    }
                ]
            })),

            updateHabit: (id, updates) => set((state) => ({
                habits: state.habits.map(habit =>
                    habit.id === id
                        ? { ...habit, ...updates }
                        : habit
                )
            })),

            removeHabit: (id) => set((state) => ({
                habits: state.habits.filter(habit => habit.id !== id)
            })),

            toggleCompletion: (id, dateString) => set((state) => {
                const habits = state.habits.map(habit => {
                    if (habit.id === id) {
                        const completedDates = habit.completedDates ? { ...habit.completedDates } : {};
                        completedDates[dateString] = !completedDates[dateString];
                        return { ...habit, completedDates };
                    }
                    return habit;
                });
                return { habits };
            }),

            updateValue: (id, dateString, value) => set((state) => {
                const habits = state.habits.map(habit => {
                    if (habit.id === id) {
                        const values = habit.values ? { ...habit.values } : {};
                        values[dateString] = value;
                        return { ...habit, values };
                    }
                    return habit;
                });
                return { habits };
            }),

            getHabitById: (id) => {
                return get().habits.find(habit => habit.id === id);
            }
        }),
        {
            name: 'habits-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export default useHabitsStore; 