/// <reference types="node" />
/// <reference types="jest" />

import "reflect-metadata";
import dotenv from "dotenv";

// Muat .env.test SEBELUM env.config di-import.
// dotenv.config() tidak menimpa variabel yang sudah ada (mis. dari CI),
// jadi aman kalau CI sudah menyetel DB_NAME.
dotenv.config({ path: ".env.test" });

process.env.NODE_ENV = "test";

// PENGAMAN WAJIB — integration test menjalankan TRUNCATE.
// Tolak berjalan di database yang namanya tidak berakhiran _test.
const namaDb = process.env.DB_NAME ?? "";
if (!namaDb.endsWith("_test")) {
  throw new Error(
    `Integration test menolak berjalan di database "${namaDb}". ` +
      `Nama database wajib berakhiran _test. Periksa file .env.test.`
  );
}