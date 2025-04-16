import { Label } from "../entities/Label";
import { getDataSource } from "../database";
import { Repository } from "typeorm";

class LabelRepository {
    private _repository: Repository<Label> | null = null;

    // Use a getter to lazily initialize the repository
    private get repository(): Repository<Label> {
        if (!this._repository) {
            this._repository = getDataSource().getRepository(Label);
        }
        return this._repository;
    }

    async findAll(): Promise<Label[]> {
        return this.repository.find({
            order: { name: "ASC" }
        });
    }

    async findById(id: number): Promise<Label | null> {
        return this.repository.findOneBy({ id });
    }

    async findByName(name: string): Promise<Label | null> {
        return this.repository.findOneBy({ name });
    }

    async create(labelData: Partial<Label>): Promise<Label> {
        const label = this.repository.create(labelData);
        return this.repository.save(label);
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id);
    }
}

export default new LabelRepository(); 