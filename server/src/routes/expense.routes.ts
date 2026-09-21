import { Router } from "express";
import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} from "../controllers/expense.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
const router = Router();

router.post("/", authenticate, createExpense);
router.get("/", authenticate, getExpenses);
router.put("/:id", authenticate, updateExpense);
router.delete("/:id", authenticate, deleteExpense);

export default router;
