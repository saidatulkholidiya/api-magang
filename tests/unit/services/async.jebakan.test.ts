import { NotFoundError } from "../../../src/utils/AppError";

// Simulasi service yang melempar error setelah delay
async function serviceGetById(id: number): Promise<{ id: number }> {
  await new Promise((r) => setTimeout(r, 10));
  if (id === 99) throw new NotFoundError("Peserta");
  return { id };
}

describe("Jebakan async", () => {
  // SALAH — tanpa await, test lolos palsu
  it("SALAH: tanpa await (test lolos meski kode rusak)", () => {
    expect(serviceGetById(99)).rejects.toThrow(NotFoundError);
  });

  // BENAR — pakai await + expect.assertions
  it("BENAR: pakai await dan expect.assertions", async () => {
    expect.assertions(2);
    await expect(serviceGetById(99)).rejects.toThrow(NotFoundError);
  });
});