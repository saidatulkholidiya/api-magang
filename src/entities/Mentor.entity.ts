import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany
} from "typeorm";
import { JurnalHarian } from "./JurnalHarian.entity";

@Entity("mentor")
export class Mentor {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 100 })
    nama!: string;

    @Column({ type: "varchar", length: 100, unique: true })
    email!: string;

    @Column({ type: "jsonb", nullable: true })
    keahlian?: string[];

    @OneToMany(() => JurnalHarian, (jurnal) => jurnal.reviewer)
    jurnalList!: JurnalHarian[];

    @CreateDateColumn()
    createdAt!: Date;
}