import { CompletedSession } from "../entities/CompletedSession";
import SessionRepository from "../repositories/sessionRepository";

class SessionHistoryService {
    async saveCompletedSession(
        durationMinutes: number,
        labelId?: number
    ): Promise<CompletedSession> {
        try {
            return await SessionRepository.create({
                durationMinutes,
                labelId,
                completedAt: new Date()
            });
        } catch (error) {
            console.error("Error saving completed session:", error);
            throw error;
        }
    }

    async getSessionHistory(
        startDate?: Date,
        endDate?: Date,
        labelId?: number
    ): Promise<CompletedSession[]> {
        try {
            return await SessionRepository.findAll({ startDate, endDate, labelId });
        } catch (error) {
            console.error("Error fetching session history:", error);
            throw error;
        }
    }

    async getSessionStats(
        startDate?: Date,
        endDate?: Date,
        labelId?: number
    ): Promise<{ 
        totalFocusSessions: number;
        totalFocusMinutes: number;
        sessionsPerDay: { date: string; count: number }[];
        sessionsByLabel?: { labelName: string; count: number; minutes: number }[];
    }> {
        try {
            const sessions = await this.getSessionHistory(startDate, endDate, labelId);
            
            const totalFocusSessions = sessions.length;
            const totalFocusMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
            
            // Group by day for chart data
            const sessionsByDay = sessions.reduce((acc, session) => {
                const dateStr = session.completedAt.toISOString().split('T')[0];
                if (!acc[dateStr]) {
                    acc[dateStr] = 0;
                }
                acc[dateStr]++;
                return acc;
            }, {} as Record<string, number>);
            
            const sessionsPerDay = Object.entries(sessionsByDay).map(([date, count]) => ({
                date,
                count
            }));
            
            // Group by label
            const sessionsByLabel = sessions.reduce((acc, session) => {
                const labelName = session.label?.name || 'Unlabeled';
                if (!acc[labelName]) {
                    acc[labelName] = { count: 0, minutes: 0 };
                }
                acc[labelName].count++;
                acc[labelName].minutes += session.durationMinutes;
                return acc;
            }, {} as Record<string, { count: number; minutes: number }>);
            
            const labelStats = Object.entries(sessionsByLabel).map(([labelName, stats]) => ({
                labelName,
                count: stats.count,
                minutes: stats.minutes
            }));
            
            return {
                totalFocusSessions,
                totalFocusMinutes,
                sessionsPerDay,
                sessionsByLabel: labelStats
            };
        } catch (error) {
            console.error("Error calculating session stats:", error);
            throw error;
        }
    }
}

export default new SessionHistoryService(); 