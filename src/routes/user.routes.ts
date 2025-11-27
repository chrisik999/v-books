import { Router } from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/user.controller";
import { validate } from "../middleware/validate";
import { listQuery, updateBody, userIdParams } from "../schemas/user.schema";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/", requireAuth, validate({ query: listQuery }), getUsers);
router.get("/:id", requireAuth, validate({ params: userIdParams }), getUser);
router.patch(
  "/:id",
  requireAuth,
  validate({ params: userIdParams, body: updateBody }),
  updateUser
);
router.delete(
  "/:id",
  requireAuth,
  validate({ params: userIdParams }),
  deleteUser
);

export default router;
