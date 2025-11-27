import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { requireAuth } from "../middleware/auth.middleware";
import {
  createBookHandler,
  listBooksHandler,
  getBookHandler,
  updateBookHandler,
  deleteBookHandler,
  deleteBooksManyHandler,
} from "../controllers/book.controller";

// Ensure upload directories exist
const imgDir = path.resolve("uploads/images");
const pdfDir = path.resolve("uploads/pdfs");
fs.mkdirSync(imgDir, { recursive: true });
fs.mkdirSync(pdfDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (
    req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    if (/pdf/i.test(file.mimetype)) cb(null, pdfDir);
    else cb(null, imgDir);
  },
  filename: (
    _req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    const ext = path.extname(file.originalname) || "";
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({ storage });

const router = Router();

// List & Get
router.get("/", requireAuth, listBooksHandler);
router.get("/:id", requireAuth, getBookHandler);

// Create (image + pdf optional)
router.post(
  "/",
  requireAuth,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  createBookHandler
);

// Update (only owner or ADMIN)
router.patch(
  "/:id",
  requireAuth,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  updateBookHandler
);

// Delete single
router.delete("/:id", requireAuth, deleteBookHandler);

// Delete many
router.post("/delete-many", requireAuth, deleteBooksManyHandler);

export default router;
