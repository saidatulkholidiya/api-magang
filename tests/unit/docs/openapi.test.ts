/// <reference types="node" />
/// <reference types="jest" />

import { spec } from "../../../src/docs/swagger";

describe("Dokumen OpenAPI", () => {
  it("memuat path/endpoint yang valid", () => {
    // Cukup pastikan spec-nya ada dan ada minimal satu path
    expect(spec).toBeDefined();
    expect(Object.keys(spec.paths ?? {}).length).toBeGreaterThan(0);
  });
});