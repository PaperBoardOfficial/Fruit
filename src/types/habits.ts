export interface DayInfo {
    dayName: string;
    day: string;
    month: string;
    date: Date;
    dateString: string;
}

export const COLOR_MAP = {
    blue: '#3b82f6',
    red: '#ef4444',
    green: '#22c55e',
    purple: '#8b5cf6',
    orange: '#f97316'
};

export const DAY_NAMES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];


export interface Habit {
    id: string;
    name: string;
    color: string;
    targetDays: string[];
    isQuantitative: boolean;
    unit?: string;
    completedDates?: Partial<Record<string, boolean>>;
    values?: Partial<Record<string, string>>;
    createdAt: number;
}
