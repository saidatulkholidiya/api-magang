import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { NotFoundError, ValidationError, UnauthorizedError } from "../utils/AppError";

const router = Router();

// GET /api/test/not-found
router.get("/not-found", asyncHandler(async (req, res) => {
    throw new NotFoundError("Test Resource");
}));

// GET /api/test/validation
router.get("/validation", asyncHandler(async (req, res) => {
    throw new ValidationError([
        { field: "fieldA", pesan: "Field A wajib diisi" },
        { field: "fieldB", pesan: "Field B minimal 5 karakter" },
        { field: "fieldC", pesan: "Field C harus berupa angka" }
    ]);
}));

// GET /api/test/unauthorized
router.get("/unauthorized", asyncHandler(async (req, res) => {
    throw new UnauthorizedError();
}));

// GET /api/test/crash
router.get("/crash", asyncHandler(async (req, res) => {
    throw new Error("Ini error tak terduga buat test");
}));

export default router;