// Session status enum with associated durations
export enum SessionStatus {
    Work = 'Work',
    Break = 'Break',
    LongBreak = 'Long Break'
}

// Add methods to the SessionStatus namespace
export namespace SessionStatus {
    // Get the duration minutes for a session status from settings
    export function getMinutes(status: SessionStatus, settings: {
        workMinutes: number;
        breakMinutes: number;
        longBreakMinutes: number;
    }): number {
        switch (status) {
            case SessionStatus.Work: return settings.workMinutes;
            case SessionStatus.Break: return settings.breakMinutes;
            case SessionStatus.LongBreak: return settings.longBreakMinutes;
        }
    }
}