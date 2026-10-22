import { FieldError, ValidationError } from "../../src/utils/AppError";

export async function fieldYangGagal(proses: Promise<unknown>): Promise<string[]> {
  try {
    await proses;
    return [];
  } catch (err) {
    if (err instanceof ValidationError) {
      return (err.detail as FieldError[]).map((d) => d.field);
    }
    throw err;
  }
}