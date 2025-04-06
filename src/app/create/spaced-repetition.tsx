import { router } from "expo-router";
import useSpacedRepetitionStore from "@/src/store/useSpacedRepetitionStore";
import SpacedRepetitionForm from "@/src/components/SpacedRepetitionForm";

export default function CreateSpacedRepetitionScreen() {
    const addReview = useSpacedRepetitionStore((state) => state.addReview);

    const handleCreate = async (data: { title: string; schedule: number[]; reminderTime: string }) => {
        await addReview(data.title, data.schedule, data.reminderTime);
        router.back();
    };

    return (
        <SpacedRepetitionForm
            mode="create"
            onSubmit={handleCreate}
        />
    );
} 