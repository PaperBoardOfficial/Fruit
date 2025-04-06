import { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import useSpacedRepetitionStore from "@/src/store/useSpacedRepetitionStore";
import SpacedRepetitionForm from "@/src/components/SpacedRepetitionForm";
import showAlert from "@/src/utils/alert";

export default function EditSpacedRepetitionScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const getReviewById = useSpacedRepetitionStore((state) => state.getReviewById);
    const updateReview = useSpacedRepetitionStore((state) => state.updateReview);
    const removeReview = useSpacedRepetitionStore((state) => state.removeReview);

    const [loading, setLoading] = useState(true);
    const [initialValues, setInitialValues] = useState<{
        title: string;
        schedule: number[];
        reminderTime: string;
    } | null>(null);

    // Load item data
    useEffect(() => {
        if (!id) {
            showAlert("Error", "No item ID provided");
            router.back();
            return;
        }

        const item = getReviewById(id);
        if (!item) {
            showAlert("Error", "Item not found");
            router.back();
            return;
        }

        setInitialValues({
            title: item.title,
            schedule: item.schedule,
            reminderTime: item.reminderTime || "09:00"
        });
        setLoading(false);
    }, [id, getReviewById]);

    const handleUpdate = async (data: { title: string; schedule: number[]; reminderTime: string }) => {
        if (!id) return;
        await updateReview(id, data);
        router.back();
    };

    const handleDelete = async () => {
        if (!id) return;
        await removeReview(id);
        router.back();
    };

    if (loading || !initialValues) {
        return (
            <View className="flex-1 justify-center items-center bg-white dark:bg-gray-900">
                <Text className="text-gray-800 dark:text-gray-200">Loading...</Text>
            </View>
        );
    }

    return (
        <SpacedRepetitionForm
            mode="edit"
            initialValues={initialValues}
            onSubmit={handleUpdate}
            onDelete={handleDelete}
        />
    );
} 