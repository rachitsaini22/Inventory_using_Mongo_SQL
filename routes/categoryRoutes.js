import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
} from "../controllers/categoryController.js";
import { auth } from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/roleAuth.js";

const router = express.Router();

// 🟢 Admin Routes
router.post("/add", auth, isAdmin, createCategory);
router.delete("/delete/:id", auth, isAdmin, deleteCategory);

// 🟢 Public/User Route
router.get("/list", auth, getAllCategories);

export default router;
