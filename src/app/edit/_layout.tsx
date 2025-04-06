import { Stack } from "expo-router";

export default function EditLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="habits/[id]"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="spaced-repetition/[id]"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    );
} 