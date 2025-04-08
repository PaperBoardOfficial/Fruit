import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import useSpacedRepetitionStore from "@/src/store/useSpacedRepetitionStore";
import { Review } from "@/src/types/spaced-repetition";
import showAlert from "@/src/utils/alert";

export default function SpacedRepetitionScreen() {
  const reviews = useSpacedRepetitionStore(state => state.reviews);
  const completeReview = useSpacedRepetitionStore(state => state.completeReview);
  const [upcomingReviews, setUpcomingReviews] = useState<Review[]>([]);

  // Calculate upcoming reviews
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all reviews and sort by date
    const upcoming = [...reviews].sort(
      (a, b) => new Date(a.nextReviewDate).getTime() - new Date(b.nextReviewDate).getTime()
    );

    setUpcomingReviews(upcoming);
  }, [reviews]);

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const currentYear = new Date().getFullYear();

    // Get day, month, and year
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();

    // Return formatted date with or without year
    if (year !== currentYear) {
      return `${day} ${month}, ${year}`;
    } else {
      return `${day} ${month}`;
    }
  };

  // Calculate days until review
  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const reviewDate = new Date(dateString);
    reviewDate.setHours(0, 0, 0, 0);

    const diffTime = reviewDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    return `In ${diffDays} days`;
  };

  // Navigate to edit screen
  const handleEditItem = (id: string) => {
    router.push(`/edit/spaced-repetition/${id}`);
  };

  // Handle completing a review
  const handleCompleteReview = (id: string) => {
    showAlert(
      "Complete Review",
      "Have you reviewed this item?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Complete",
          onPress: async () => {
            await completeReview(id);
          }
        }
      ]
    );
  };

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <View className="flex-row justify-between items-center p-4">
        <Text className="text-xl font-bold text-gray-800 dark:text-white">
          Upcoming Reviews
        </Text>
        <Pressable
          onPress={() => router.push("/create/spaced-repetition")}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Ionicons name="add" size={28} color="#f97316" />
        </Pressable>
      </View>

      {upcomingReviews.length === 0 ? (
        <View className="flex-1 justify-center items-center p-8">
          <Ionicons name="calendar-outline" size={64} color="#d1d5db" />
          <Text className="text-gray-500 dark:text-gray-400 text-center mt-4 text-lg">
            No upcoming reviews
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-center mt-2">
            Tap the + button to add a new study item
          </Text>
        </View>
      ) : (
        <ScrollView className="flex-1 px-4">
          {upcomingReviews.map(review => (
            <View key={review.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-4">
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-800 dark:text-white">
                    {review.title}
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-300 mt-1">
                    {formatDate(review.nextReviewDate)} • {getDaysUntil(review.nextReviewDate)}
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                    Review #{review.reviewCount + 1}
                  </Text>
                </View>
                <View className="flex-row">
                  <Pressable
                    onPress={() => handleCompleteReview(review.id)}
                    hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                    className="p-2 mr-2 border border-gray-300 dark:border-gray-600 rounded-full"
                  >
                    <Ionicons name="checkmark" size={18} color="#f97316" />
                  </Pressable>
                  <Pressable
                    onPress={() => handleEditItem(review.id)}
                    hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-full"
                  >
                    <Ionicons name="pencil" size={18} color="#f97316" />
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
} 