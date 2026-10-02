import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn
} from "typeorm";
import { Peserta } from "./Peserta.entity";

@Entity("refresh_token")
export class RefreshToken {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "text" })
    token!: string;

    @ManyToOne(() => Peserta, { nullable: false })
    @JoinColumn({ name: "peserta_id" })
    peserta!: Peserta;

    @Column({ name: "peserta_id", type: "int" })
    pesertaId!: number;

    @Column({ type: "timestamp" })
    expiresAt!: Date;

    @CreateDateColumn()
    createdAt!: Date;
}