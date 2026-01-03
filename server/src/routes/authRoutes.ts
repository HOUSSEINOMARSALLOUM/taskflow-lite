import express from "express";
import * as authController from "../controllers/authController";
import { authenticate } from "../utils/jwt";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.get("/me", authenticate, authController.getMe);
router.post("/logout", authenticate, authController.logout);

export default router;
