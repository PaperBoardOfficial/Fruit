import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen 
        name="pomodoro" 
      />
      <Stack.Screen 
        name="spaced-repetition" 
      />
      <Stack.Screen 
        name="habits" 
      />
    </Stack>
  );
}