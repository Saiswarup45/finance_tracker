const BASE = "https://finance-tracker-u0ih.onrender.com/api";

const req = async (url, opts={}) => {
  const res = await fetch(BASE+url, { headers:{"Content-Type":"application/json"}, ...opts });
  if(res.status===204) return null;
  if(!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
};

export const api = {
  // Transactions
  getTransactions:    ()       => req("/transactions/"),
  createTransaction:  (data)   => req("/transactions/",        {method:"POST",  body:JSON.stringify(data)}),
  updateTransaction:  (id,data)=> req(`/transactions/${id}/`,  {method:"PUT",   body:JSON.stringify(data)}),
  deleteTransaction:  (id)     => req(`/transactions/${id}/`,  {method:"DELETE"}),

  // Budgets
  getBudgets:    ()       => req("/budgets/"),
  createBudget:  (data)   => req("/budgets/",        {method:"POST",  body:JSON.stringify(data)}),
  updateBudget:  (id,data)=> req(`/budgets/${id}/`,  {method:"PUT",   body:JSON.stringify(data)}),
  deleteBudget:  (id)     => req(`/budgets/${id}/`,  {method:"DELETE"}),

  // Goals
  getGoals:    ()       => req("/goals/"),
  createGoal:  (data)   => req("/goals/",        {method:"POST",  body:JSON.stringify(data)}),
  updateGoal:  (id,data)=> req(`/goals/${id}/`,  {method:"PUT",   body:JSON.stringify(data)}),
  deleteGoal:  (id)     => req(`/goals/${id}/`,  {method:"DELETE"}),
};