import { dataJurnal } from "../data/dummy";
import { Jurnal } from "../types";

export const jurnalRepository = {
    findAll(): Jurnal[] {
        return dataJurnal;
    },

    findById(id: number): Jurnal | undefined {
        return dataJurnal.find(j => j.id === id);
    },

    findByPesertaId(pesertaId: number): Jurnal[] {
        return dataJurnal.filter(j => j.pesertaId === pesertaId);
    },

    create(jurnal: Jurnal): Jurnal {
        dataJurnal.push(jurnal);
        return jurnal;
    },

    update(id: number, data: Partial<Jurnal>): Jurnal | undefined {
        const index = dataJurnal.findIndex(j => j.id === id);
        if (index === -1) return undefined;
        dataJurnal[index] = { ...dataJurnal[index], ...data } as Jurnal;
        return dataJurnal[index];
    },

    delete(id: number): boolean {
        const index = dataJurnal.findIndex(j => j.id === id);
        if (index === -1) return false;
        dataJurnal.splice(index, 1);
        return true;
    },

    nextId(): number {
        return dataJurnal.length > 0
            ? Math.max(...dataJurnal.map(j => j.id)) + 1
            : 1;
    }
};