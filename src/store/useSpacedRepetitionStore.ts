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
    completeReview: (id: string) => Promise<void>;
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

                if (!item) return;

                let needsReschedule = false;

                // Check if schedule has changed
                if (updates.schedule && JSON.stringify(updates.schedule) !== JSON.stringify(item.schedule)) {
                    needsReschedule = true;

                    // Calculate the next review date based on the new schedule and current review count
                    const today = new Date();
                    let nextReviewDate = new Date(today);

                    // If we have a review count and it's within the bounds of the new schedule
                    if (item.reviewCount < updates.schedule.length) {
                        // Use the current review count to determine the next interval from the new schedule
                        const nextInterval = updates.schedule[item.reviewCount];
                        nextReviewDate.setDate(today.getDate() + nextInterval);
                    } else {
                        // If we've exceeded the new schedule length, use the last interval
                        const lastInterval = updates.schedule[updates.schedule.length - 1];
                        nextReviewDate.setDate(today.getDate() + lastInterval);
                    }

                    // Add the calculated next review date to the updates
                    updates.nextReviewDate = nextReviewDate.toISOString();
                }

                // Check if reminder time has changed
                if (updates.reminderTime && updates.reminderTime !== item.reminderTime) {
                    needsReschedule = true;
                }

                // If the next review date is being updated directly
                if (updates.nextReviewDate && updates.nextReviewDate !== item.nextReviewDate) {
                    needsReschedule = true;
                }

                // Reschedule notification if needed
                if (needsReschedule) {
                    // Cancel the existing reminder if there is one
                    if (item.reminderId) {
                        await cancelScheduledNotification(item.reminderId);
                    }

                    // Schedule a new reminder
                    try {
                        const nextReviewDate = new Date(updates.nextReviewDate || item.nextReviewDate);
                        const reminderTime = updates.reminderTime || item.reminderTime;
                        const title = updates.title || item.title;

                        const reminderId = await scheduleReviewReminder(
                            id,
                            title,
                            nextReviewDate,
                            reminderTime
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
                    reviews: state.reviews.map((review) =>
                        review.id === id ? { ...review, ...updates } : review
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

            completeReview: async (id) => {
                const item = get().reviews.find(item => item.id === id);

                if (!item) return;

                // Increment the review count
                const newReviewCount = item.reviewCount + 1;

                // Check if this was the final review in the schedule
                if (newReviewCount >= item.schedule.length) {
                    // If this was the final review, remove the item
                    if (item.reminderId) {
                        await cancelScheduledNotification(item.reminderId);
                    }

                    // Remove the item from the reviews list
                    set((state) => ({
                        reviews: state.reviews.filter((review) => review.id !== id)
                    }));

                    return;
                }

                // If not the final review, proceed with scheduling the next review
                const today = new Date();
                let nextReviewDate = new Date(today);

                // Get the next interval based on the new review count
                const nextInterval = item.schedule[newReviewCount];

                // Set the next review date
                nextReviewDate.setDate(today.getDate() + nextInterval);

                // Cancel the existing reminder if there is one
                if (item.reminderId) {
                    await cancelScheduledNotification(item.reminderId);
                }

                // Schedule a new reminder
                let reminderId: string | undefined;
                try {
                    reminderId = await scheduleReviewReminder(
                        id,
                        item.title,
                        nextReviewDate,
                        item.reminderTime || "09:00"
                    );
                } catch (error) {
                    console.error('Failed to schedule reminder:', error);
                }

                // Update the item
                set((state) => ({
                    reviews: state.reviews.map((review) =>
                        review.id === id
                            ? {
                                ...review,
                                reviewCount: newReviewCount,
                                nextReviewDate: nextReviewDate.toISOString(),
                                reminderId: reminderId || review.reminderId
                            }
                            : review
                    ),
                }));
            },
        }),
        {
            name: 'spaced-repetition-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export default useSpacedRepetitionStore; 