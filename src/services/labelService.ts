import LabelRepository from "../repositories/labelRepository";
import { Label } from "../entities/Label";

class LabelService {
    constructor(private labelRepository = LabelRepository) { }

    async getAllLabels(): Promise<Label[]> {
        try {
            return await this.labelRepository.findAll();
        } catch (error) {
            console.error("Error fetching labels:", error);
            throw error;
        }
    }

    async createLabel(name: string): Promise<Label> {
        try {
            // Validation
            if (!name.trim()) {
                throw new Error("Label name cannot be empty");
            }

            // Check if label with this name already exists
            const existingLabel = await this.labelRepository.findByName(name.trim());
            if (existingLabel) {
                throw new Error(`Label "${name}" already exists`);
            }

            return await this.labelRepository.create({ name: name.trim() });
        } catch (error) {
            console.error("Error creating label:", error);
            throw error;
        }
    }

    async deleteLabel(id: number): Promise<void> {
        try {
            await this.labelRepository.delete(id);
        } catch (error) {
            console.error("Error deleting label:", error);
            throw error;
        }
    }
}

export default new LabelService(); 