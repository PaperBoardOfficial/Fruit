export interface Review {
    id: string;
    title: string;
    createdAt: string;
    nextReviewDate: string;
    reviewCount: number;
    schedule: number[];
    reminderId?: string;
    reminderTime?: string;
}