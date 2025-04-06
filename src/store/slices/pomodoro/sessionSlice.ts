import { StateCreator } from 'zustand';
import { PomodoroState } from '../../usePomodoroStore';
import { SessionStatus } from '@/src/types/pomodoro';

export interface SessionSlice {
  // Session state
  status: SessionStatus;
  sessionCount: number;

  // Session actions
  skipToNextSession: () => Promise<void>;
}

export const createSessionSlice: StateCreator<
  PomodoroState,
  [],
  [],
  SessionSlice
> = (set, get) => ({
  // Initial session state
  status: SessionStatus.Work,
  sessionCount: 0,

  // Session actions
  skipToNextSession: async () => {
    const {
      status,
      sessionCount,
      sessionsUntilLongBreak,
      autoContinue,
    } = get();

    // Determine next session type
    let nextStatus: SessionStatus;
    let nextSessionCount = sessionCount;

    if (status === SessionStatus.Work) {
      nextStatus = sessionCount % sessionsUntilLongBreak === 0 ?
        SessionStatus.LongBreak : SessionStatus.Break;
    } else {
      nextStatus = SessionStatus.Work;
      nextSessionCount = sessionCount + 1;
    }

    const minutes = SessionStatus.getMinutes(nextStatus, get());

    set({
      status: nextStatus,
      sessionCount: nextSessionCount,
      isActive: autoContinue,
      minutes,
      seconds: 0,
    });

    if (autoContinue) {
      try {
        await get().startTimer();
      } catch (error) {
        console.error('Failed to auto-start next session:', error);
      }
    }

  },
}); 