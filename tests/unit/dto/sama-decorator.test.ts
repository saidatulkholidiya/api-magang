// @ts-nocheck

import { validate } from "class-validator";
import { Sama } from "../../../src/dto/decorators/sama";

class Contoh {
  password!: string;

  @Sama("password", { message: "konfirmasiPassword harus sama dengan password" })
  konfirmasiPassword!: string;
}

function buat(data: Partial<Contoh>): Contoh {
  return Object.assign(new Contoh(), data);
}

describe("decorator @Sama", () => {
  it("lolos jika nilai sama", async () => {
    const err = await validate(buat({ password: "rahasia123", konfirmasiPassword: "rahasia123" }));
    expect(err).toHaveLength(0);
  });

  it("gagal jika nilai berbeda", async () => {
    const err = await validate(buat({ password: "rahasia123", konfirmasiPassword: "beda12345" }));
    expect(err).toHaveLength(1);
    expect(err[0].property).toBe("konfirmasiPassword");
  });

  it("gagal jika field pembanding tidak ada", async () => {
    const err = await validate(buat({ konfirmasiPassword: "rahasia123" }));
    expect(err).toHaveLength(1);
  });

  it("pesan default menyebut nama field yang dibandingkan", async () => {
    const err = await validate(buat({ password: "rahasia123", konfirmasiPassword: "beda" }));
    const pesan = Object.values(err[0].constraints ?? {}).join(" ");
    expect(pesan).toContain("password");
  });

  it("pesan custom dipakai jika diberikan", async () => {
    const err = await validate(buat({ password: "rahasia123", konfirmasiPassword: "beda" }));
    const pesan = Object.values(err[0].constraints ?? {}).join(" ");
    expect(pesan).toBe("konfirmasiPassword harus sama dengan password");
  });

  it("string kosong sama dengan string kosong tetap lolos", async () => {
    const err = await validate(buat({ password: "", konfirmasiPassword: "" }));
    expect(err).toHaveLength(0);
  });
});
