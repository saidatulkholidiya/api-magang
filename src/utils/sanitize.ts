export function tanpaPassword<T extends { password?: string }>(
    data: T
): Omit<T, "password"> {
    const { password, ...aman } = data;
    return aman;
}