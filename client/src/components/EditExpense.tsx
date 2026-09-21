import { useState } from "react";
import type { FormEvent } from "react";
import api from "../services/api";

interface Expense {
  id: number;
  amount: number | string;
  description?: string;
  date: string;
  category: string;
}

interface EditExpenseProps {
  expense: Expense;
  onUpdated: () => void;
  onCancel: () => void;
}

const EditExpense = ({
  expense,
  onUpdated,
  onCancel,
}: EditExpenseProps) => {
  const [amount, setAmount] = useState(String(expense.amount));
  const [description, setDescription] = useState(
    expense.description || ""
  );
  const [category, setCategory] = useState(expense.category);
  const [date, setDate] = useState(
    new Date(expense.date).toISOString().split("T")[0]
  );

  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");

    const token = localStorage.getItem("token");

    try {
      await api.put(
        `/expenses/${expense.id}`,
        {
          amount,
          description,
          category,
          date,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onUpdated();
    } catch (error: any) {
      setMessage(
        error.response?.data?.message ||
          "Failed to update expense"
      );
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-5">
        Edit Expense
      </h3>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Education">Education</option>
            <option value="Health">Health</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>

          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="md:col-span-2 flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Update Expense
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            Cancel
          </button>
        </div>

        {message && (
          <p className="md:col-span-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default EditExpense;
