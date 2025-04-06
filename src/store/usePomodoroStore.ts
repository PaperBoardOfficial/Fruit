import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { TimerSlice, createTimerSlice } from './slices/pomodoro/timerSlice';
import { SessionSlice, createSessionSlice } from './slices/pomodoro/sessionSlice';
import { SettingsSlice, createSettingsSlice } from './slices/pomodoro/settingsSlice';

// Combine all slices into one state type
export type PomodoroState = TimerSlice & SessionSlice & SettingsSlice;

/**
 * Pomodoro timer store with persistence
 * Uses AsyncStorage to save settings and session progress
 */
const usePomodoroStore = create<PomodoroState>()(
  persist(
    (...a) => ({
      ...createTimerSlice(...a),
      ...createSessionSlice(...a),
      ...createSettingsSlice(...a),
    }),
    {
      name: 'pomodoro-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Settings
        workMinutes: state.workMinutes,
        breakMinutes: state.breakMinutes,
        longBreakMinutes: state.longBreakMinutes,
        sessionsUntilLongBreak: state.sessionsUntilLongBreak,
        autoContinue: state.autoContinue,
        
        // Session progress
        status: state.status,
        sessionCount: state.sessionCount,

        // Timer
        isActive: state.isActive,
        endTime: state.endTime,
        currentNotificationId: state.currentNotificationId,
      }),
    }
  )
);

export default usePomodoroStore; 