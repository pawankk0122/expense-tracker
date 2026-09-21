import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AddExpense from "../components/AddExpense";
import EditExpense from "../components/EditExpense";

interface Expense {
  id: number;
  amount: number | string;
  description?: string;
  date: string;
  category: string;
}

const Dashboard = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] =
    useState<Expense | null>(null);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await api.get("/expenses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setExpenses(response.data.expenses);
    } catch (error) {
      console.error("Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/expenses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchExpenses();
    } catch (error) {
      console.error("Failed to delete expense");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const total = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Expense Tracker
          </h1>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user.name}
            </span>

            <button
              onClick={handleLogout}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Dashboard
          </h2>

          <p className="text-gray-500 mt-1">
            Track and manage your expenses.
          </p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500">
              Total Expenses
            </p>

            <h3 className="text-3xl font-bold text-gray-900 mt-2">
              ₹{total.toFixed(2)}
            </h3>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500">
              Number of Expenses
            </p>

            <h3 className="text-3xl font-bold text-gray-900 mt-2">
              {expenses.length}
            </h3>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500">
              Average Expense
            </p>

            <h3 className="text-3xl font-bold text-gray-900 mt-2">
              ₹
              {expenses.length > 0
                ? (total / expenses.length).toFixed(2)
                : "0.00"}
            </h3>
          </div>
        </div>

        {/* Add Expense */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <AddExpense onExpenseAdded={fetchExpenses} />
        </div>

        {/* Edit Expense */}
        {editingExpense && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <EditExpense
              expense={editingExpense}
              onUpdated={() => {
                setEditingExpense(null);
                fetchExpenses();
              }}
              onCancel={() => setEditingExpense(null)}
            />
          </div>
        )}

        {/* Expenses Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Expenses
            </h3>
          </div>

          {loading ? (
            <div className="p-6">
              <p className="text-gray-500">
                Loading expenses...
              </p>
            </div>
          ) : expenses.length === 0 ? (
            <div className="p-6">
              <p className="text-gray-500">
                No expenses found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Category
                    </th>

                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Description
                    </th>

                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Amount
                    </th>

                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Date
                    </th>

                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {expenses.map((expense) => (
                    <tr
                      key={expense.id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                          {expense.category}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-700">
                        {expense.description || "-"}
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        ₹{Number(expense.amount).toFixed(2)}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(
                          expense.date
                        ).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              setEditingExpense(expense)
                            }
                            className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(expense.id)
                            }
                            className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
