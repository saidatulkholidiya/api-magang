export function potongTeks(teks: string, max: number): string {
    if (teks.length <= max) return teks;
    const batasIsi = Math.max(0, max - 3);
    return teks.slice(0, batasIsi) + "...";
}