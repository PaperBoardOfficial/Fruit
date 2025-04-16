import "reflect-metadata";
import { Stack } from "expo-router";
import "@/global.css";
import { useEffect } from "react";
import notificationService from "@/src/services/notificationService";
import { initializeDatabase } from "../database";

export default function RootLayout() {
  useEffect(() => {
    notificationService.initialize();
    const setupDatabase = async () => {
      try {
        await initializeDatabase();
      } catch (error) {
        console.error("Failed to initialize database:", error);
      }
    };

    setupDatabase();
  }, []);

  return (
    <Stack initialRouteName="(tabs)">
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="settings"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="create"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="edit"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
