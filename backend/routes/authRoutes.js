import express from "express";
import { register, login, logout } from "../controllers/authController.js";
import { authorize } from "../middleware/authMiddleware.js";
import protect from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", protect, logout);

router.get("/me", protect, (req, res) => {
  return res.json(req.user);
});

// admin protected
router.get("/admin", protect, authorize("admin"), (req, res) => {
  res.json({ message: "Admin access granted" });
});

export default router;
