import { StateCreator } from 'zustand';
import { PomodoroState } from '../../usePomodoroStore';
import {
  scheduleTimerEndNotification,
  cancelScheduledNotification
} from '@/src/services/notificationService';
import { SessionStatus } from '@/src/types/pomodoro';

export interface TimerSlice {
  // Timer state
  isActive: boolean;
  endTime: number | null;
  minutes: number;
  seconds: number;
  currentNotificationId: string | null;

  // Timer control functions
  startTimer: () => Promise<void>;
  pauseTimer: () => Promise<void>;
  resetTimer: () => Promise<void>;
  updateTimer: () => void;
}

export const createTimerSlice: StateCreator<
  PomodoroState,
  [],
  [],
  TimerSlice
> = (set, get) => {
  return {
    // Initial timer state
    isActive: false,
    endTime: null,
    minutes: 25,
    seconds: 0,
    currentNotificationId: null,

    updateTimer: () => {
      const {
        isActive,
        endTime,
        skipToNextSession,
      } = get();

      if (!isActive || !endTime) {
        return;
      }
      const remaining = Math.max(0, endTime - Date.now());

      if (remaining > 0) {
        const totalSeconds = Math.ceil(remaining / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        set({ minutes, seconds });

        // Update UI every second using requestAnimationFrame
        requestAnimationFrame(() => {
          setTimeout(() => {
            if (get().isActive) {
              get().updateTimer();
            }
          }, 1000);
        });
      } else {
        skipToNextSession();
      }
    },

    // Combined start/resume function
    startTimer: async () => {
      const {
        minutes,
        seconds,
        status,
        updateTimer
      } = get();

      // Check if we're resuming or starting fresh
      const isResuming = get().isActive === false && (minutes < SessionStatus.getMinutes(status, get()) || seconds > 0);

      // Calculate total seconds for the timer
      let totalSeconds;

      if (isResuming) {
        // Resume: calculate from current minutes/seconds
        totalSeconds = (minutes * 60) + seconds;
      } else {
        // Start fresh: get full duration for current status
        const fullMinutes = SessionStatus.getMinutes(status, get());
        totalSeconds = fullMinutes * 60;
      }

      const newEndTime = Date.now() + (totalSeconds * 1000);

      // Schedule a notification for when the timer ends
      try {
        const notificationId = await scheduleTimerEndNotification(status, newEndTime);

        // Store the notification ID so we can cancel it if needed
        set({
          endTime: newEndTime,
          isActive: true,
          currentNotificationId: notificationId
        });

        // Start the UI update timer
        updateTimer();
      } catch (error) {
        console.error('Failed to schedule notification:', error);
      }
    },

    pauseTimer: async () => {
      const { currentNotificationId } = get();

      // Cancel the scheduled notification
      await cancelScheduledNotification(currentNotificationId);

      set({
        isActive: false,
        endTime: null,
        currentNotificationId: null
      });
    },

    resetTimer: async () => {
      const { status, currentNotificationId } = get();

      // Cancel any scheduled notification
      await cancelScheduledNotification(currentNotificationId);

      // Get minutes for current status
      const minutes = SessionStatus.getMinutes(status, get());

      set({
        isActive: false,
        endTime: null,
        minutes,
        seconds: 0,
        currentNotificationId: null
      });
    },
  };
}; 