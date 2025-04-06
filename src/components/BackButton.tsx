import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function BackButton() {
  const router = useRouter();
  
  return (
    <View className="p-4 flex-row items-center mb-4">
      <Pressable onPress={() => router.back()} className="mr-3">
        <Ionicons name="arrow-back" size={24} color="#f97316" />
      </Pressable>
    </View>
  );
} 