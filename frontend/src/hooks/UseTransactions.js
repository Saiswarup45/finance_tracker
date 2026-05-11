import { useState, useEffect, useCallback } from "react";
import { api } from "../api/transactions";

export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [txns, bdgs] = await Promise.all([
        api.getTransactions(),
        api.getBudgets().catch(() => []),
      ]);
      setTransactions(txns);
      setBudgets(bdgs);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const addTransaction = async (data) => {
    await api.createTransaction({ ...data, amount: parseFloat(data.amount) });
    await fetchAll();
  };

  const updateTransaction = async (id, data) => {
    await api.updateTransaction(id, { ...data, amount: parseFloat(data.amount) });
    await fetchAll();
  };

  const deleteTransaction = async (id) => {
    await api.deleteTransaction(id);
    await fetchAll();
  };

  const addBudget = async (data) => {
    await api.createBudget({ ...data, limit: parseFloat(data.limit) });
    await fetchAll();
  };

  const updateBudget = async (id, data) => {
    await api.updateBudget(id, { ...data, limit: parseFloat(data.limit) });
    await fetchAll();
  };

  const deleteBudget = async (id) => {
    await api.deleteBudget(id);
    await fetchAll();
  };

  // Computed stats
  const income = transactions
    .filter((t) => t.transaction_type === "income")
    .reduce((s, t) => s + parseFloat(t.amount), 0);

  const expense = transactions
    .filter((t) => t.transaction_type === "expense")
    .reduce((s, t) => s + parseFloat(t.amount), 0);

  const balance = income - expense;

  // Monthly stats (current month)
  const now = new Date();
  const thisMonth = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const monthlyIncome = thisMonth
    .filter((t) => t.transaction_type === "income")
    .reduce((s, t) => s + parseFloat(t.amount), 0);

  const monthlyExpense = thisMonth
    .filter((t) => t.transaction_type === "expense")
    .reduce((s, t) => s + parseFloat(t.amount), 0);

  return {
    transactions,
    budgets,
    loading,
    error,
    income,
    expense,
    balance,
    monthlyIncome,
    monthlyExpense,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addBudget,
    updateBudget,
    deleteBudget,
    refresh: fetchAll,
  };
}