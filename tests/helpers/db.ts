/// <reference types="node" />
/// <reference types="jest" />

import { AppDataSource } from "../../src/config/database.config";

export async function bersihkanDatabase(): Promise<void> {
  const tabel = AppDataSource.entityMetadatas
    .map((m) => `"${m.tableName}"`)
    .join(", ");
  await AppDataSource.query(`TRUNCATE ${tabel} RESTART IDENTITY CASCADE`);
}