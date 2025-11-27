import { Router } from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/user.controller";
import { validate } from "../middleware/validate";
import { listQuery, updateBody, userIdParams } from "../schemas/user.schema";

const router = Router();

router.get("/", validate({ query: listQuery }), getUsers);
router.get("/:id", validate({ params: userIdParams }), getUser);
router.patch(
  "/:id",
  validate({ params: userIdParams, body: updateBody }),
  updateUser
);
router.delete("/:id", validate({ params: userIdParams }), deleteUser);

export default router;
