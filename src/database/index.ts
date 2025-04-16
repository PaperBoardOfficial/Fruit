import { DataSource } from "typeorm";
import { CompletedSession } from "../entities/CompletedSession";
import { Label } from "../entities/Label";

let dataSource: DataSource | null = null;

export async function initializeDatabase(): Promise<DataSource> {
    try {
        if (dataSource && dataSource.isInitialized) {
            return dataSource;
        }

        dataSource = new DataSource({
            type: "expo",
            database: "pomodoro.db",
            logging: __DEV__,
            synchronize: true,
            entities: [
                CompletedSession,
                Label
            ],
            driver: require("expo-sqlite")
        });

        await dataSource.initialize();
        console.log("Database connection established");
        return dataSource;
    } catch (error) {
        console.error("Database connection failed:", error);
        throw error;
    }
}

export function getDataSource(): DataSource {
    if (!dataSource || !dataSource.isInitialized) {
        throw new Error("Database not initialized. Call initializeDatabase first.");
    }
    return dataSource;
} 