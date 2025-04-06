import { Stack } from "expo-router";
import "@/global.css";
import { useEffect } from "react";
import { intializeNotificationService } from "@/src/services/notificationService";

export default function RootLayout() {

  useEffect(() => {
    intializeNotificationService();
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
