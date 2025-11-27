import { Router } from "express";
import { getMyWallet } from "../controllers/wallet.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/", requireAuth, getMyWallet);

export default router;
