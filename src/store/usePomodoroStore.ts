import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SessionStatus } from '../types/pomodoro';
import { Label } from '../entities/Label';

interface PomodoroState {
  minutes: number;
  seconds: number;
  focusMinutes: number;
  breakMinutes: number;
  longBreakMinutes: number;
  sessionsUntilLongBreak: number;
  autoContinue: boolean;
  status: SessionStatus;
  sessionCount: number;
  isActive: boolean;
  endTime: number | null;
  currentNotificationId: string | null;
  selectedLabel: Label | null;
  setSelectedLabel: (label: Label | null) => void;
}

/**
 * Pomodoro timer store with persistence
 */
const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set, get) => ({
      minutes: 25,
      seconds: 0,
      focusMinutes: 25,
      breakMinutes: 5,
      longBreakMinutes: 15,
      sessionsUntilLongBreak: 4,
      autoContinue: false,
      status: SessionStatus.Focus,
      sessionCount: 0,
      isActive: false,
      endTime: null,
      currentNotificationId: null,
      selectedLabel: null,
      setSelectedLabel: (label) => set({ selectedLabel: label }),
    }),
    {
      name: 'pomodoro-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        focusMinutes: state.focusMinutes,
        breakMinutes: state.breakMinutes,
        longBreakMinutes: state.longBreakMinutes,
        sessionsUntilLongBreak: state.sessionsUntilLongBreak,
        autoContinue: state.autoContinue,
        status: state.status,
        sessionCount: state.sessionCount,
        isActive: state.isActive,
        endTime: state.endTime,
        currentNotificationId: state.currentNotificationId,
        selectedLabel: state.selectedLabel,
      }),
    }
  )
);

export default usePomodoroStore; 