import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("labels")
export class Label {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;
} 