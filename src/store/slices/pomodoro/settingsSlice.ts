import { StateCreator } from 'zustand';
import { PomodoroState } from '../../usePomodoroStore';
import { SessionStatus } from '@/src/types/pomodoro';

export interface SettingsSlice {
  // Settings
  workMinutes: number;
  breakMinutes: number;
  longBreakMinutes: number;
  sessionsUntilLongBreak: number;
  autoContinue: boolean;

  // Settings actions
  setWorkMinutes: (minutes: number) => void;
  setBreakMinutes: (minutes: number) => void;
  setLongBreakMinutes: (minutes: number) => void;
  setSessionsUntilLongBreak: (sessions: number) => void;
  setAutoContinue: (autoContinue: boolean) => void;
}

export const createSettingsSlice: StateCreator<
  PomodoroState,
  [],
  [],
  SettingsSlice
> = (set, get) => ({
  // Default settings
  workMinutes: 25,
  breakMinutes: 5,
  longBreakMinutes: 15,
  sessionsUntilLongBreak: 4,
  autoContinue: false,

  // Settings actions
  setWorkMinutes: (minutes: number) => {
    set({ workMinutes: minutes });

    // Update display if current status is Work and timer is not active
    const { status, isActive } = get();
    if (status === SessionStatus.Work && !isActive) {
      set({ minutes, seconds: 0 });
    }
  },

  setBreakMinutes: (minutes: number) => {
    set({ breakMinutes: minutes });

    // Update display if current status is Break and timer is not active
    const { status, isActive } = get();
    if (status === SessionStatus.Break && !isActive) {
      set({ minutes, seconds: 0 });
    }
  },

  setLongBreakMinutes: (minutes: number) => {
    set({ longBreakMinutes: minutes });

    // Update display if current status is Long Break and timer is not active
    const { status, isActive } = get();
    if (status === SessionStatus.LongBreak && !isActive) {
      set({ minutes, seconds: 0 });
    }
  },

  setSessionsUntilLongBreak: (sessions: number) => {
    set({ sessionsUntilLongBreak: sessions });
  },

  setAutoContinue: (autoContinue: boolean) => {
    set({ autoContinue });
  },
}); 