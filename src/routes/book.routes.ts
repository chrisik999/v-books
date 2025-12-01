import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate";
import {
  listQuery,
  bookIdParams,
  createBody,
  updateBody,
  deleteManyBody,
} from "../schemas/book.schema";
import {
  createBookHandler,
  listBooksHandler,
  listMyBooksHandler,
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
router.get("/", requireAuth, validate({ query: listQuery }), listBooksHandler);
router.get(
  "/mine",
  requireAuth,
  validate({ query: listQuery }),
  listMyBooksHandler
);
router.get("/:id", requireAuth, validate({ params: bookIdParams }), getBookHandler);

// Create (image + pdf optional)
router.post(
  "/",
  requireAuth,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  validate({ body: createBody }),
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
  validate({ params: bookIdParams, body: updateBody }),
  updateBookHandler
);

// Delete single
router.delete(
  "/:id",
  requireAuth,
  validate({ params: bookIdParams }),
  deleteBookHandler
);

// Delete many
router.post(
  "/delete-many",
  requireAuth,
  validate({ body: deleteManyBody }),
  deleteBooksManyHandler
);

export default router;
