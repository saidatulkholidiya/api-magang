import { dataPeserta } from "../data/dummy";
import { Peserta } from "../types";

export const pesertaRepository = {
    findAll(): Peserta[] {
        return dataPeserta;
    },

    findById(id: number): Peserta | undefined {
        return dataPeserta.find(p => p.id === id);
    },

    create(peserta: Peserta): Peserta {
        dataPeserta.push(peserta);
        return peserta;
    },

    update(id: number, data: Partial<Peserta>): Peserta | undefined {
        const index = dataPeserta.findIndex(p => p.id === id);
        if (index === -1) return undefined;
        dataPeserta[index] = { ...dataPeserta[index], ...data } as Peserta;
        return dataPeserta[index];
    },

    delete(id: number): boolean {
        const index = dataPeserta.findIndex(p => p.id === id);
        if (index === -1) return false;
        dataPeserta.splice(index, 1);
        return true;
    },

    nextId(): number {
        return dataPeserta.length > 0
            ? Math.max(...dataPeserta.map(p => p.id)) + 1
            : 1;
    }
};