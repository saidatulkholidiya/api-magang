/// <reference types="node" />
/// <reference types="jest" />

// Nyalakan limiter SEBELUM app di-import
process.env.RATE_LIMIT_AKTIF = "1";

import request from "supertest";
import app from "../../src/app";

afterAll(() => {
  delete process.env.RATE_LIMIT_AKTIF;
});

describe("Rate limit global", () => {
  it("request ke-11 dalam 1 menit menghasilkan 429 RATE_LIMITED", async () => {
    // 10 request pertama: boleh lewat (mungkin 404 karena route tidak ada, tapi bukan 429)
    for (let i = 0; i < 10; i++) {
      const res = await request(app).get("/api/v1/tidak-ada");
      expect(res.status).not.toBe(429);
    }

    // Request ke-11: harus 429
    const res = await request(app).get("/api/v1/tidak-ada");
    expect(res.status).toBe(429);
    expect(res.body.error.kode).toBe("RATE_LIMITED");
  });
});