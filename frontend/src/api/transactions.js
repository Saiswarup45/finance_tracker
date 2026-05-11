const BASE_URL = "http://localhost:8000/api";

export const api = {
  // Transactions
  getTransactions: async () => {
    const res = await fetch(`${BASE_URL}/transactions/`);
    if (!res.ok) throw new Error("Failed to fetch transactions");
    return res.json();
  },

  createTransaction: async (data) => {
    const res = await fetch(`${BASE_URL}/transactions/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create transaction");
    return res.json();
  },

  updateTransaction: async (id, data) => {
    const res = await fetch(`${BASE_URL}/transactions/${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update transaction");
    return res.json();
  },

  deleteTransaction: async (id) => {
    const res = await fetch(`${BASE_URL}/transactions/${id}/`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete transaction");
  },

  // Budgets
  getBudgets: async () => {
    const res = await fetch(`${BASE_URL}/budgets/`);
    if (!res.ok) throw new Error("Failed to fetch budgets");
    return res.json();
  },

  createBudget: async (data) => {
    const res = await fetch(`${BASE_URL}/budgets/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create budget");
    return res.json();
  },

  updateBudget: async (id, data) => {
    const res = await fetch(`${BASE_URL}/budgets/${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update budget");
    return res.json();
  },

  deleteBudget: async (id) => {
    const res = await fetch(`${BASE_URL}/budgets/${id}/`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete budget");
  },
};