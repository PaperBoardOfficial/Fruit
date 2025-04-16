import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Label } from "./Label";

@Entity("completed_sessions")
export class CompletedSession {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    durationMinutes: number;

    @CreateDateColumn()
    completedAt: Date;

    @ManyToOne(() => Label, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn()
    label?: Label;

    @Column({ nullable: true })
    labelId?: number;
} 