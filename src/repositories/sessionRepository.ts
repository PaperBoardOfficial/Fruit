import { CompletedSession } from "../entities/CompletedSession";
import { getDataSource } from "../database";
import { Repository } from "typeorm";

class SessionRepository {
    private _repository: Repository<CompletedSession> | null = null;

    // Use a getter to lazily initialize the repository
    private get repository(): Repository<CompletedSession> {
        if (!this._repository) {
            this._repository = getDataSource().getRepository(CompletedSession);
        }
        return this._repository;
    }

    async findAll(options?: {
        startDate?: Date;
        endDate?: Date;
        labelId?: number;
    }): Promise<CompletedSession[]> {
        let query = this.repository.createQueryBuilder("session")
            .leftJoinAndSelect("session.label", "label");

        if (options?.startDate) {
            query = query.where("session.completedAt >= :startDate", { startDate: options.startDate });
        }

        if (options?.endDate) {
            query = query.andWhere("session.completedAt <= :endDate", { endDate: options.endDate });
        }

        if (options?.labelId) {
            query = query.andWhere("session.labelId = :labelId", { labelId: options.labelId });
        }

        return query.orderBy("session.completedAt", "DESC").getMany();
    }

    async create(sessionData: Partial<CompletedSession>): Promise<CompletedSession> {
        const session = this.repository.create(sessionData);
        return this.repository.save(session);
    }
}

export default new SessionRepository(); 