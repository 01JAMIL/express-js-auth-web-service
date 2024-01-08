import { Router } from "express";
import {
  getUserDataById,
  refreshAccessToken,
  signIn,
  signUp,
} from "../controllers/user.controller";
import { protectUserRoute } from "../middlewares/user.middleware";

const router: Router = Router();

// POST requests
router.post("/auth/signup", signUp);
router.post("/auth/signin", signIn);
router.post("/auth/refresh-token", refreshAccessToken);

// GET requests
router.get("/profile/:id", protectUserRoute, getUserDataById);

export default router;
