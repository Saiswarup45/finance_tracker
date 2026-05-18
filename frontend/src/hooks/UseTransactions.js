import { useState, useEffect, useCallback } from "react";
import { api } from "../api/transactions";

export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [budgets,      setBudgets]      = useState([]);
  const [goals,        setGoals]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [t,b,g] = await Promise.all([
        api.getTransactions(),
        api.getBudgets().catch(()=>[]),
        api.getGoals().catch(()=>[]),
      ]);
      setTransactions(t); setBudgets(b); setGoals(g);
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(()=>{ fetchAll(); },[fetchAll]);

  // Transaction actions
  const addTransaction    = async (d) => { await api.createTransaction({...d,amount:parseFloat(d.amount)}); await fetchAll(); };
  const updateTransaction = async (id,d) => { await api.updateTransaction(id,{...d,amount:parseFloat(d.amount)}); await fetchAll(); };
  const deleteTransaction = async (id)   => { await api.deleteTransaction(id); await fetchAll(); };

  // Budget actions
  const addBudget    = async (d) => { await api.createBudget({...d,limit:parseFloat(d.limit)}); await fetchAll(); };
  const updateBudget = async (id,d) => { await api.updateBudget(id,{...d,limit:parseFloat(d.limit)}); await fetchAll(); };
  const deleteBudget = async (id)   => { await api.deleteBudget(id); await fetchAll(); };

  // Goal actions
  const addGoal    = async (d)   => { await api.createGoal({...d,target:parseFloat(d.target),saved:parseFloat(d.saved||0)}); await fetchAll(); };
  const updateGoal = async (id,d)=> { await api.updateGoal(id,{...d,target:parseFloat(d.target),saved:parseFloat(d.saved)}); await fetchAll(); };
  const deleteGoal = async (id)  => { await api.deleteGoal(id); await fetchAll(); };

  // Computed stats (all time)
  const income  = transactions.filter(t=>t.transaction_type==="income") .reduce((s,t)=>s+parseFloat(t.amount),0);
  const expense = transactions.filter(t=>t.transaction_type==="expense").reduce((s,t)=>s+parseFloat(t.amount),0);
  const balance = income - expense;

  // This month
  const now = new Date();
  const thisMonthTxns = transactions.filter(t=>{
    const d=new Date(t.date);
    return d.getMonth()===now.getMonth() && d.getFullYear()===now.getFullYear();
  });
  const monthlyIncome  = thisMonthTxns.filter(t=>t.transaction_type==="income") .reduce((s,t)=>s+parseFloat(t.amount),0);
  const monthlyExpense = thisMonthTxns.filter(t=>t.transaction_type==="expense").reduce((s,t)=>s+parseFloat(t.amount),0);

  // Last month
  const lm = new Date(now.getFullYear(), now.getMonth()-1);
  const lastMonthTxns = transactions.filter(t=>{
    const d=new Date(t.date);
    return d.getMonth()===lm.getMonth() && d.getFullYear()===lm.getFullYear();
  });
  const lastMonthExpense = lastMonthTxns.filter(t=>t.transaction_type==="expense").reduce((s,t)=>s+parseFloat(t.amount),0);

  const savingsRate = income>0 ? Math.round(((income-expense)/income)*100) : 0;

  return {
    transactions, budgets, goals,
    loading, error,
    income, expense, balance,
    monthlyIncome, monthlyExpense, lastMonthExpense,
    savingsRate, thisMonthTxns,
    addTransaction, updateTransaction, deleteTransaction,
    addBudget, updateBudget, deleteBudget,
    addGoal, updateGoal, deleteGoal,
    refresh: fetchAll,
  };
}