import { Response } from "express";
import prisma from "../config/prisma.js";
import { AuthRequest } from "../middleware/auth.middleware.js";
// CREATE EXPENSE
export const createExpense = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { amount, description, date, category } = req.body;

    if (!amount || !category) {
      return res.status(400).json({
        success: false,
        message: "Amount and category are required",
      });
    }

    const expense = await prisma.expense.create({
      data: {
        amount: Number(amount),
        description,
        date: date ? new Date(date) : new Date(),
        category,
        userId: req.user!.userId,
      },
    });

    res.status(201).json({
      success: true,
      message: "Expense created successfully",
      expense,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create expense",
    });
  }
};

// GET ALL EXPENSES
export const getExpenses = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const expenses = await prisma.expense.findMany({
      where: {
        userId: req.user!.userId,
      },
      orderBy: {
        date: "desc",
      },
    });

    res.json({
      success: true,
      expenses,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch expenses",
    });
  }
};
// UPDATE EXPENSE
export const updateExpense = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const expenseId = Number(req.params.id);
    const { amount, description, date, category } = req.body;

    const existingExpense = await prisma.expense.findFirst({
      where: {
        id: expenseId,
        userId: req.user!.userId,
      },
    });

    if (!existingExpense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    const expense = await prisma.expense.update({
      where: {
        id: expenseId,
      },
      data: {
        amount: amount !== undefined ? Number(amount) : undefined,
        description,
        date: date ? new Date(date) : undefined,
        category,
      },
    });

    res.json({
      success: true,
      message: "Expense updated successfully",
      expense,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update expense",
    });
  }
};

// DELETE EXPENSE
export const deleteExpense = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const expenseId = Number(req.params.id);

    const existingExpense = await prisma.expense.findFirst({
      where: {
        id: expenseId,
        userId: req.user!.userId,
      },
    });

    if (!existingExpense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    await prisma.expense.delete({
      where: {
        id: expenseId,
      },
    });

    res.json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete expense",
    });
  }
};
