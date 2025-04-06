import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { nanoid } from 'nanoid';
import { scheduleReviewReminder, cancelScheduledNotification } from '@/src/services/notificationService';
import { Review } from '../types/spaced-repetition';


interface SpacedRepetitionState {
    reviews: Review[];
    addReview: (title: string, schedule: number[], reminderTime?: string) => Promise<void>;
    updateReview: (id: string, updates: Partial<Review>) => Promise<void>;
    removeReview: (id: string) => Promise<void>;
    getReviewById: (id: string) => Review | undefined;
}


const useSpacedRepetitionStore = create<SpacedRepetitionState>()(
    persist(
        (set, get) => ({
            reviews: [],

            addReview: async (title, schedule, reminderTime = "09:00") => {
                const today = new Date();
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);

                const id = nanoid();
                const nextReviewDate = tomorrow.toISOString();

                // First add the item without the reminder ID
                set((state) => ({
                    reviews: [
                        ...state.reviews,
                        {
                            id,
                            title,
                            createdAt: today.toISOString(),
                            nextReviewDate,
                            reviewCount: 0,
                            schedule,
                            reminderTime,
                        },
                    ],
                }));

                // Schedule a reminder notification
                try {
                    const reminderId = await scheduleReviewReminder(id, title, tomorrow, reminderTime);

                    // Update the item with the reminder ID if we got one
                    if (reminderId) {
                        set(state => ({
                            reviews: state.reviews.map(item =>
                                item.id === id ? { ...item, reminderId } : item
                            )
                        }));
                    }
                } catch (error) {
                    console.error('Failed to schedule reminder:', error);
                }
            },

            updateReview: async (id, updates) => {
                const item = get().reviews.find(item => item.id === id);

                // If the next review date is being updated, reschedule the notification
                if (item && updates.nextReviewDate && updates.nextReviewDate !== item.nextReviewDate) {
                    // Cancel the existing reminder if there is one
                    if (item.reminderId) {
                        await cancelScheduledNotification(item.reminderId);
                    }

                    // Schedule a new reminder
                    try {
                        const nextReviewDate = new Date(updates.nextReviewDate);
                        const reminderId = await scheduleReviewReminder(
                            id,
                            updates.title || item.title,
                            nextReviewDate,
                            item.reminderTime || "09:00"
                        );

                        // Update with the new reminder ID
                        if (reminderId) {
                            updates.reminderId = reminderId;
                        }
                    } catch (error) {
                        console.error('Failed to reschedule reminder:', error);
                    }
                }

                // Update the item
                set((state) => ({
                    reviews: state.reviews.map((item) =>
                        item.id === id ? { ...item, ...updates } : item
                    ),
                }));
            },

            removeReview: async (id) => {
                const item = get().reviews.find(item => item.id === id);

                // Cancel the reminder if it exists
                if (item?.reminderId) {
                    await cancelScheduledNotification(item.reminderId);
                }

                // Remove the item
                set((state) => ({
                    reviews: state.reviews.filter((item) => item.id !== id),
                }));
            },

            getReviewById: (id) => {
                return get().reviews.find((item) => item.id === id);
            },
        }),
        {
            name: 'spaced-repetition-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export default useSpacedRepetitionStore; 