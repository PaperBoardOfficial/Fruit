import { usePomodoroStore } from "../store";
import { SessionStatus } from "../types/pomodoro";
import notificationService from "./notificationService";
import sessionHistoryService from "./sessionHistoryService";

class PomodoroService {
    async startTimer() {
        try {
            const { minutes, seconds, status, isActive } = usePomodoroStore.getState();
            const isResuming = isActive === false && (minutes < this.getMinutes(status) || seconds > 0);
            let totalSeconds;
            if (isResuming) {
                totalSeconds = (minutes * 60) + seconds;
            } else {
                const fullMinutes = this.getMinutes(status);
                totalSeconds = fullMinutes * 60;
            }
            const newEndTime = Date.now() + (totalSeconds * 1000);
            const notificationId = await notificationService.scheduleTimerEndNotification(status, newEndTime);
            usePomodoroStore.setState({
                endTime: newEndTime,
                isActive: true,
                currentNotificationId: notificationId
            });
            this.updateTimer();
        } catch (error) {
            console.error('Error starting timer:', error);
            throw error;
        }
    }

    async updateTimer() {
        try {
            const { isActive, endTime } = usePomodoroStore.getState();
            if (!isActive || !endTime) {
                return;
            }
            const remaining = Math.max(0, endTime - Date.now());
            if (remaining > 0) {
                const totalSeconds = Math.ceil(remaining / 1000);
                const minutes = Math.floor(totalSeconds / 60);
                const seconds = totalSeconds % 60;
                usePomodoroStore.setState({ minutes, seconds });
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        if (isActive) {
                            this.updateTimer();
                        }
                    }, 1000);
                });
            } else {
                this.skipToNextSession();
            }
        } catch (error) {
            console.error('Error updating timer:', error);
            throw error;
        }
    }

    async skipToNextSession() {
        try {
            const { status, sessionCount, sessionsUntilLongBreak, autoContinue, minutes, selectedLabel } = usePomodoroStore.getState();

            // Only save completed focus sessions
            if (status === SessionStatus.Focus) {
                await this.saveCompletedSession(minutes, selectedLabel?.id);
            }

            let nextStatus: SessionStatus;
            let nextSessionCount = sessionCount;
            if (status === SessionStatus.Focus) {
                nextStatus = sessionCount % sessionsUntilLongBreak === 0 ?
                    SessionStatus.LongBreak : SessionStatus.Break;
            } else {
                nextStatus = SessionStatus.Focus;
                nextSessionCount = sessionCount + 1;
            }
            const nextMinutes = this.getMinutes(nextStatus);
            usePomodoroStore.setState({
                status: nextStatus,
                sessionCount: nextSessionCount,
                isActive: autoContinue,
                minutes: nextMinutes,
                seconds: 0,
            });
            if (autoContinue) {
                this.startTimer();
            }
        } catch (error) {
            console.error('Error skipping to next session:', error);
            throw error;
        }
    }

    async pauseTimer() {
        try {
            const { currentNotificationId } = usePomodoroStore.getState();
            await notificationService.cancelScheduledNotification(currentNotificationId);
            usePomodoroStore.setState({
                isActive: false,
                endTime: null,
                currentNotificationId: null
            });
        } catch (error) {
            console.error('Error pausing timer:', error);
            throw error;
        }
    }

    async resetTimer() {
        try {
            const { status, currentNotificationId } = usePomodoroStore.getState();
            await notificationService.cancelScheduledNotification(currentNotificationId);
            const minutes = this.getMinutes(status);
            usePomodoroStore.setState({
                isActive: false,
                endTime: null,
                minutes,
                seconds: 0,
                currentNotificationId: null
            });
        } catch (error) {
            console.error('Error resetting timer:', error);
            throw error;
        }
    }

    // Simplified method to save only focus sessions
    private async saveCompletedSession(durationMinutes: number, labelId?: number) {
        try {
            await sessionHistoryService.saveCompletedSession(durationMinutes, labelId);
        } catch (error) {
            console.error('Error saving completed session:', error);
            // Don't throw here to prevent disrupting the main flow
        }
    }
    private getMinutes(status: SessionStatus) {
        const settings = usePomodoroStore.getState();
        switch (status) {
            case SessionStatus.Focus: return settings.focusMinutes;
            case SessionStatus.Break: return settings.breakMinutes;
            case SessionStatus.LongBreak: return settings.longBreakMinutes;
        }
    }
}

export default new PomodoroService();
